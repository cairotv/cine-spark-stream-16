#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import time
import requests
import json
from datetime import datetime
from supabase import create_client, Client
from youtube_transcript_api import YouTubeTranscriptApi
import google.generativeai as genai

# -------------------- الإعدادات --------------------
TMDB_API_KEY = 'afef094e7c0de13c1cac98227a61da4d'
SUPABASE_URL = 'https://lhpuuwpbhpccqkwqugknh.supabase.co'
SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocHV3dXBiaHBjcWt3cXVna2hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkwOTI4OCwiZXhwIjoyMDg2NDg1Mjg4fQ.yqLUJq2PfiSM5osZIXjCjRetRuSiSvz8Lv6Q51BHeD8'
YOUTUBE_API_KEY = 'AIzaSyCXvR18OjBz_s9sQJzUie_LsD_Os6rtaqc'
GEMINI_API_KEY = 'AIzaSyB6XGL8KmBsjv7uvwEgXgPKGPWopwGK3O8'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
genai.configure(api_key=GEMINI_API_KEY)

# -------------------- دوال مساعدة --------------------
def get_rating_color(imdb_id: str, release_dates: list) -> str:
    """تحديد لون التصنيف بناءً على الشهادة"""
    for rd in release_dates:
        if rd.get('iso_3166_1') == 'US':
            cert = rd['release_dates'][0].get('certification', '')
            if cert in ['G', 'PG']:
                return 'green'
            if cert == 'PG-13':
                return 'yellow'
            if cert in ['R', 'NC-17', 'TV-MA']:
                return 'red'
    return 'yellow'

def fetch_youtube_summary(movie_title: str, year: int) -> str | None:
    """البحث في يوتيوب عن مراجعة الفيلم وجلب النص"""
    try:
        # 1. البحث عن فيديو مراجعة
        search_url = f"https://www.googleapis.com/youtube/v3/search"
        params = {
            'part': 'snippet',
            'q': f"{movie_title} {year} review",
            'key': YOUTUBE_API_KEY,
            'maxResults': 1,
            'type': 'video',
            'relevanceLanguage': 'en'
        }
        resp = requests.get(search_url, params=params).json()
        if not resp.get('items'):
            return None
        
        video_id = resp['items'][0]['id']['videoId']
        
        # 2. جلب الترجمة
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        transcript = transcript_list.find_transcript(['en'])
        text = ' '.join([t['text'] for t in transcript.fetch()[:50]])  # أول 50 مقطع
        
        # 3. تلخيص باستخدام Gemini
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"قم بتلخيص المراجعة التالية لفيلم '{movie_title}' في 3 جمل قصيرة باللغة العربية الفصحى:

{text}"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ خطأ في جلب ملخص يوتيوب لـ {movie_title}: {e}")
        return None

def sync_movies():
    """جلب الأفلام الشائعة من TMDB وتحديث قاعدة البيانات"""
    page = 1
    while True:
        print(f"📥 جلب الصفحة {page}...")
        url = f"https://api.themoviedb.org/3/movie/popular"
        params = {
            'api_key': TMDB_API_KEY,
            'language': 'ar-SA',
            'page': page
        }
        try:
            resp = requests.get(url, params=params, timeout=15)
            data = resp.json()
        except Exception as e:
            print(f"⚠️ خطأ في الاتصال: {e}")
            break
        
        if not data.get('results'):
            break
        
        for movie in data['results']:
            # جلب التفاصيل الكاملة للحصول على تواريخ الإصدار والشهادات
            detail_url = f"https://api.themoviedb.org/3/movie/{movie['id']}"
            detail_params = {
                'api_key': TMDB_API_KEY,
                'append_to_response': 'release_dates'
            }
            detail = requests.get(detail_url, params=detail_params).json()
            
            rating_color = get_rating_color(None, detail.get('release_dates', {}).get('results', []))
            
            # جلب ملخص يوتيوب (مرة واحدة فقط إذا لم يكن موجوداً)
            ai_summary = None
            # التحقق مما إذا كان الفيلم موجوداً أصلاً
            existing = supabase.table('movies').select('ai_summary').eq('id', movie['id']).execute()
            if not existing.data or not existing.data[0].get('ai_summary'):
                print(f"🎬 جاري تحليل {movie['title']}...")
                ai_summary = fetch_youtube_summary(movie['title'], movie.get('release_date', '')[:4])
                time.sleep(1)  # تجنب تجاوز حدود API
            
            # إدراج أو تحديث
            movie_data = {
                'id': movie['id'],
                'title': movie['title'],
                'arabic_title': movie.get('title'),  # يمكن تحسينه لاحقاً
                'overview': movie.get('overview'),
                'ai_summary': ai_summary,
                'rating_color': rating_color,
                'genres': json.dumps(detail.get('genres', [])),
                'release_date': movie.get('release_date'),
                'poster_path': movie.get('poster_path'),
                'backdrop_path': movie.get('backdrop_path'),
                'custom_embed_url': None
            }
            
            supabase.table('movies').upsert(movie_data).execute()
            print(f"✅ {movie['title']} - {rating_color}")
        
        page += 1
        if page > 10:  # حد 10 صفحات فقط
            break

if __name__ == '__main__':
    print("🚀 بدء مزامنة المحتوى...")
    sync_movies()
    print("🎉 انتهى!")