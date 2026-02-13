import os
import requests
import time
from supabase import create_client
import json

# ----------------------------------------------------------
# 🔐 إعدادات الاتصال (استبدل القيم الموجودة بمفاتيحك)
# ----------------------------------------------------------
SUPABASE_URL = "https://lhpuuwpbhpccqkwqugknh.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocHV3dXBiaHBjcWt3cXVna2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDkyODgsImV4cCI6MjA4NjQ4NTI4OH0.QCYzJaWo0mmFQwZjwaNjIJR1jR4wOb4CbqTKxTAaO2w"
TMDB_KEY = "afef094e7c0de13c1cac98227a61da4d"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ----------------------------------------------------------
# 🎯 دالة تحديد التصنيف العمري (Traffic Light)
# ----------------------------------------------------------
def get_age_rating(item_id, media_type):
    try:
        if media_type == 'movie':
            url = f"https://api.themoviedb.org/3/movie/{item_id}/release_dates?api_key={TMDB_KEY}"
        else:
            url = f"https://api.themoviedb.org/3/tv/{item_id}/content_ratings?api_key={TMDB_KEY}"
        data = requests.get(url, timeout=10).json()
        results = data.get('results', [])
        for res in results:
            if res['iso_3166_1'] == 'US':
                if media_type == 'movie':
                    for cert in res['release_dates']:
                        if cert.get('certification'):
                            return cert['certification']
                else:
                    return res.get('rating', 'NR')
    except:
        pass
    return 'NR'

def determine_traffic_light(cert):
    red_list = ['R', 'NC-17', 'TV-MA', 'X', '21']
    yellow_list = ['PG-13', 'TV-14', '16', '18']
    if cert in red_list:
        return 'red'
    if cert in yellow_list:
        return 'yellow'
    return 'green'

# ----------------------------------------------------------
# 📥 دالة جلب الأفلام أو المسلسلات وحفظها في Supabase
# ----------------------------------------------------------
def fetch_and_organize(media_type, pages_to_fetch=5):
    print(f"🚀 بدء جلب {media_type}...")
    table_name = 'movies' if media_type == 'movie' else 'tv_series'
    
    for page in range(1, pages_to_fetch + 1):
        try:
            url = f"https://api.themoviedb.org/3/discover/{media_type}?api_key={TMDB_KEY}&language=ar-SA&sort_by=popularity.desc&vote_average.gte=5&page={page}"
            resp = requests.get(url, timeout=15)
            if resp.status_code != 200:
                continue
            results = resp.json().get('results', [])
            for item in results:
                try:
                    # تجاهل الأفلام للكبار فقط (ممنوع)
                    if item.get('adult') is True:
                        continue
                    
                    item_id = item['id']
                    rating_code = get_age_rating(item_id, media_type)
                    light_color = determine_traffic_light(rating_code)
                    
                    # ✅ البيانات المطابقة تماماً لجدول Supabase
                    row = {
                        "id": item_id,
                        "title": item.get('title') if media_type == 'movie' else item.get('name'),
                        "arabic_title": None,  # سنملأه لاحقاً يدوياً
                        "overview": item.get('overview'),
                        "ai_summary": None,    # هيتملأ من Gemini بعدين
                        "rating_color": light_color,
                        "genres": json.dumps(item.get('genre_ids', [])),  # تخزين كـ JSON
                        "release_date": item.get('release_date') if media_type == 'movie' else item.get('first_air_date'),
                        "poster_path": item.get('poster_path'),
                        "backdrop_path": item.get('backdrop_path'),
                        "custom_embed_url": None
                    }
                    
                    # إدراج أو تحديث
                    supabase.table(table_name).upsert(row).execute()
                    print(f"✅ {row['title']} - {light_color}")
                except Exception as e:
                    print(f"⚠️ خطأ في item {item.get('id')}: {e}")
                    continue
            time.sleep(0.5)  # احترام حدود API
        except Exception as e:
            print(f"⚠️ خطأ في الصفحة {page}: {e}")
            continue

# ----------------------------------------------------------
# ▶️ التنفيذ
# ----------------------------------------------------------
if __name__ == "__main__":
    fetch_and_organize('movie')
    fetch_and_organize('tv')
    print("🎉 انتهى جلب المحتوى!")
