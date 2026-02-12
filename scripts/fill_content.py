import os
import requests
import time
from supabase import create_client

# إعدادات الاتصال
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
TMDB_KEY = os.getenv("TMDB_API_KEY")

def get_age_rating(item_id, media_type):
    try:
        url = f"https://api.themoviedb.org/3/{media_type}/{item_id}/{'release_dates' if media_type == 'movie' else 'content_ratings'}?api_key={TMDB_KEY}"
        data = requests.get(url, timeout=10).json() # أضفنا timeout لمنع التعليق
        results = data.get('results', [])
        for res in results:
            if res['iso_3166_1'] == 'US':
                if media_type == 'movie':
                    for cert in res['release_dates']:
                        if cert['certification']: return cert['certification']
                else:
                    return res['rating']
    except: pass
    return "NR"

def determine_traffic_light(cert):
    red_list = ['NC-17', 'X', '21', 'R', 'TV-MA'] # وسعنا القائمة الحمراء للأمان
    yellow_list = ['16', '18', 'TV-14']
    if cert in red_list: return 'red'
    if cert in yellow_list: return 'yellow'
    return 'green'

def fetch_and_organize(media_type, pages_to_fetch=20): # قللنا العدد لـ 20 لضمان السرعة حالياً
    print(f"🚦 بدء السحب الآمن لـ {media_type}...")
    
    for page in range(1, pages_to_fetch + 1):
        try:
            url = f"https://api.themoviedb.org/3/discover/{media_type}?api_key={TMDB_KEY}&language=ar-SA&sort_by=popularity.desc&vote_average.gte=5&page={page}"
            response = requests.get(url, timeout=10)
            
            if response.status_code != 200:
                print(f"⚠️ تخطي الصفحة {page} بسبب خطأ في الاتصال")
                continue

            results = response.json().get('results', [])
            
            for item in results:
                try: # حماية إضافية لكل فيلم لوحده
                    if item.get('adult') is True: continue

                    item_id = item['id']
                    rating_code = get_age_rating(item_id, media_type)
                    light_color = determine_traffic_light(rating_code)
                    
                    row = {
                        "id": item_id,
                        "title": item.get('title') if media_type == 'movie' else item.get('name'),
                        "overview": item.get('overview'),
                        "poster_path": item.get('poster_path'),
                        "backdrop_path": item.get('backdrop_path'),
                        "vote_average": item.get('vote_average'),
                        "release_date": item.get('release_date') if media_type == 'movie' else item.get('first_air_date'),
                        "age_rating": rating_code,
                        "rating_color": light_color,
                        "popularity": item.get('popularity')
                    }
                    
                    table = "movies" if media_type == 'movie' else "tv_series"
                    supabase.table(table).upsert(row).execute()
                    print(f"✅ {row['title']} ({light_color})")
                    
                except Exception as e:
                    print(f"⚠️ خطأ بسيط في فيلم واحد: {e}")
                    continue # كمل للي بعده ولا توقف
                    
            time.sleep(0.5) # استراحة لعدم إرهاق السيرفر

        except Exception as e:
            print(f"❌ خطأ كبير في الصفحة {page}: {e}")

if __name__ == "__main__":
    fetch_and_organize('movie', pages_to_fetch=20)
    fetch_and_organize('tv', pages_to_fetch=20)
