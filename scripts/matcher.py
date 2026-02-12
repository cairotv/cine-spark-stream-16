import os
import requests
import google.generativeai as genai
from supabase import create_client

# 1. إعداد الاتصالات بالخزنة (Secrets)
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
YT_KEY = os.getenv("YOUTUBE_API_KEY")

def get_video_details(video_id):
    """سحب الوصف والتعليقات واسم صاحب القناة من يوتيوب"""
    url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id={video_id}&key={YT_KEY}"
    # سحب التعليقات (لقراءة أسماء الأفلام من كلام الناس)
    comments_url = f"https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId={video_id}&maxResults=20&key={YT_KEY}"
    
    data = requests.get(url).json()['items'][0]
    comments_data = requests.get(comments_url).json().get('items', [])
    comments_text = " ".join([c['snippet']['topLevelComment']['snippet']['textDisplay'] for c in comments_data])
    
    return {
        "title": data['snippet']['title'],
        "description": data['snippet']['description'],
        "channel_name": data['snippet']['channelTitle'],
        "comments": comments_text
    }

def ai_match_content(video_info):
    """العقل المدبر: يحلل كل شيء ليعرف اسم الفيلم"""
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
    بناءً على:
    - العنوان: {video_info['title']}
    - الوصف: {video_info['description']}
    - تعليقات الجمهور: {video_info['comments']}
    
    استخرج بدقة اسم الفيلم أو المسلسل المذكور. رد فقط بالاسم الأصلي (عربي أو إنجليزي).
    لو لم تتعرف عليه أجب بـ 'Unknown'.
    """
    response = model.generate_content(prompt)
    return response.text.strip()

def start_engine():
    # هنا الماكينة تبدأ في فحص القناة @film.feel.50
    # وتبحث عن التطابقات في جداولك
    print("🚀 AI Engine is running... Matching summaries to Cinema Online database.")

if __name__ == "__main__":
    start_engine()
