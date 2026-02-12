import os
import requests
import google.generativeai as genai
from supabase import create_client

# 1. إعداد الاتصالات
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def get_movie_match_from_ai(video_info):
    """يستخدم Gemini لتحليل الفيديو والتعرف على الفيلم"""
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"""
    حلل البيانات التالية لفيديو من يوتيوب واستخرج اسم الفيلم أو المسلسل المذكور بدقة:
    العنوان: {video_info['title']}
    الوصف: {video_info['description']}
    التعليقات: {video_info['comments']}
    
    أريد النتيجة كاسم فقط (باللغة الإنجليزية أو العربية كما هو في الأصل). 
    إذا لم تكن متأكداً، أجب بـ 'Unknown'.
    """
    response = model.generate_content(prompt)
    return response.text.strip()

def sync_channel(channel_handle):
    # كود سحب بيانات القناة والفيديوهات والتعليقات من يوتيوب
    # ثم مطابقتها وحفظها في جدول summaries بـ Supabase
    print(f"جاري فحص قناة: {channel_handle}...")
    # (هنا يوضع منطق السحب والربط الذي شرحناه سابقاً)

if __name__ == "__main__":
    sync_channel("@film.feel.50")
