import os
import requests
import time
from supabase import create_client

# إعدادات الاتصال
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
TMDB_KEY = os.getenv("TMDB_API_KEY")

def get_age_rating(details, media_type):
    """استخراج الفئة العمرية (MPAA Rating)"""
    try:
        if media_type == 'movie':
            releases = details.get('release_dates', {}).get('results', [])
            for rel in releases:
                if rel['iso_3166_1'] == 'US': # التصنيف الأمريكي المعياري
                    for cert in rel['release_dates']:
                        if cert['certification']: return cert['certification']
        else: # مسلسلات
            ratings = details.get('content_ratings', {}).get('results', [])
            for rating in ratings:
                if rating['iso_3166_1'] == 'US': return rating['rating']
    except:
        pass
    return "Not Rated"

def get_trailer(details):
    videos = details.get('videos', {}).get('results', [])
    for vid in videos:
        if vid['site'] == 'YouTube' and vid['type'] == 'Trailer':
            return vid['key']
    return None

def fetch_and_store_pro(media_type, total_items=50): # اجعل الرقم 10000 لاحقاً
    print(f"🚀 بدء السحب الشامل لـ {media_type}...")
    pages = (total_items // 20) + 1
    
    for page in range(1, pages + 1):
        try:
            url = f"https://api.themoviedb.org/3/discover/{media_type}?api_key={TMDB_KEY}&language=ar-SA&sort_by=popularity.desc&vote_average.gte=5&page={page}"
            response = requests.get(url).json()
            
            for item in response.get('results', []):
                item_id = item['id']
                # جلب التفاصيل العميقة (Deep Dive)
                append = "credits,videos,release_dates" if media_type == 'movie' else "credits,videos,content_ratings"
                detail_url = f"https://api.themoviedb.org/3/{media_type}/{item_id}?api_key={TMDB_KEY}&language=ar-SA&append_to_response={append}"
                det = requests.get(detail_url).json()
                
                # تجهيز البيانات
                row = {
                    "id": item_id,
                    "title": det.get('title') if media_type == 'movie' else det.get('name'),
                    "arabic_title": det.get('title') if media_type == 'movie' else det.get('name'),
                    "overview": det.get('overview'),
                    "poster_path": det.get('poster_path'),
                    "backdrop_path": det.get('backdrop_path'),
                    "vote_average": det.get('vote_average'),
                    "release_date": det.get('release_date') if media_type == 'movie' else det.get('first_air_date'),
                    "popularity": det.get('popularity'),
                    "age_rating": get_age_rating(det, media_type),
                    "trailer_key": get_trailer(det)
                }
                
                # الحفظ في المخزن
                table = "movies" if media_type == 'movie' else "tv_series"
                supabase.table(table).upsert(row).execute()
                print(f"✅ تم إضافة: {row['title']} | {row['age_rating']}")
                time.sleep(0.1)
        except Exception as e:
            print(f"خطأ: {e}")

if __name__ == "__main__":
    # تشغيل السحب (يمكنك زيادة الرقم هنا)
    fetch_and_store_pro('movie', total_items=50)
    fetch_and_store_pro('tv', total_items=50)
