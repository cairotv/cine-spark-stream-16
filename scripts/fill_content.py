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
            # البحث عن التصنيف الأمريكي US
            for rel in releases:
                if rel['iso_3166_1'] == 'US':
                    for cert in rel['release_dates']:
                        if cert['certification']: return cert['certification']
        else: # TV Series
            ratings = details.get('content_ratings', {}).get('results', [])
            for rating in ratings:
                if rating['iso_3166_1'] == 'US': return rating['rating']
    except:
        pass
    return "Not Rated"

def get_trailer(details):
    """استخراج رابط التريلر من يوتيوب"""
    videos = details.get('videos', {}).get('results', [])
    for vid in videos:
        if vid['site'] == 'YouTube' and vid['type'] == 'Trailer':
            return vid['key']
    return None

def fetch_and_store_pro(media_type, total_items=1000):
    print(f"🚀 بدء السحب الشامل لـ {media_type} (بيانات + ممثلين + تقييم عمري)...")
    
    # حساب عدد الصفحات (كل صفحة فيها 20 عنصر)
    pages = (total_items // 20) + 1
    
    for page in range(1, pages + 1):
        # 1. جلب القائمة العامة
        url = f"https://api.themoviedb.org/3/discover/{media_type}?api_key={TMDB_KEY}&language=ar-SA&sort_by=popularity.desc&vote_average.gte=5&page={page}"
        response = requests.get(url)
        if response.status_code != 200: continue
        
        results = response.json().get('results', [])
        
        for item in results:
            item_id = item['id']
            
            # 2. جلب التفاصيل العميقة لكل عنصر (Deep Dive)
            # append_to_response: تتيح جلب الممثلين، الفيديوهات، والتقييم العمري في طلب واحد
            append = "credits,videos,release_dates" if media_type == 'movie' else "credits,videos,content_ratings"
            detail_url = f"https://api.themoviedb.org/3/{media_type}/{item_id}?api_key={TMDB_KEY}&language=ar-SA&append_to_response={append}"
            
            det = requests.get(detail_url).json()
            
            # 3. تجهيز البيانات الشاملة
            row = {
                "id": item_id,
                "title": det.get('title') if media_type == 'movie' else det.get('name'),
                "arabic_title": det.get('title') if media_type == 'movie' else det.get('name'), # حفظنا العنوان العربي
                "overview": det.get('overview'),
                "poster_path": det.get('poster_path'),
                "backdrop_path": det.get('backdrop_path'),
                "vote_average": det.get('vote_average'),
                "release_date": det.get('release_date') if media_type == 'movie' else det.get('first_air_date'),
                "popularity": det.get('popularity'),
                "age_rating": get_age_rating(det, media_type),
                "genres": det.get('genres', []), # قائمة التصنيفات
                "trailer_key": get_trailer(det),
                "runtime": det.get('runtime') if media_type == 'movie' else None
            }
            
            # حفظ العمل الفني
            table = "movies" if media_type == 'movie' else "tv_series"
            supabase.table(table).upsert(row).execute()
            
            # 4. حفظ فريق العمل (Cast & Crew)
            credits = det.get('credits', {})
            # الممثلين (أول 10 فقط لتخفيف الحمل)
            cast = credits.get('cast', [])[:10]
            # المخرجين
            crew = [c for c in credits.get('crew', []) if c['job'] == 'Director']
            
            full_crew = cast + crew
            
            for person in full_crew:
                # إضافة الشخص لجدول people
                supabase.table("people").upsert({
                    "id": person['id'],
                    "name": person['name'],
                    "profile_path": person['profile_path']
                }).execute()
                
                # ربط الشخص بالعمل
                link_data = {
                    "person_id": person['id'],
                    "character_name": person.get('character'),
                    "job": "Actor" if person in cast else "Director",
                    "order_index": person.get('order', 0)
                }
                if media_type == 'movie': link_data["movie_id"] = item_id
                else: link_data["series_id"] = item_id
                
                # نستخدم Try/Except لتجنب تكرار الربط
                try: supabase.table("credits").upsert(link_data).execute()
                except: pass

            print(f"✅ تم إضافة: {row['title']} | التصنيف: {row['age_rating']}")
            time.sleep(0.1) # استراحة قصيرة جداً

if __name__ == "__main__":
    # يمكنك تعديل الرقم هنا لزيادة الكمية
    # سحب 50 فيلم و 50 مسلسل للتجربة الأولية السريعة
    # (ارفع الرقم لـ 10000 عندما تكون جاهزاً للانتظار)
    fetch_and_store_pro('movie', total_items=50) 
    fetch_and_store_pro('tv', total_items=50)
