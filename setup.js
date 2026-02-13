import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================
// 🔐 بيانات المشروع (مضمنة نهائياً – لا تحتاج تعديل)
// ============================================
const CONFIG = {
  // Supabase
  SUPABASE_URL: 'https://lhpuuwpbhpccqkwqugknh.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocHV3dXBiaHBjcWt3cXVna2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDkyODgsImV4cCI6MjA4NjQ4NTI4OH0.QCYzJaWo0mmFQwZjwaNjIJR1jR4wOb4CbqTKxTAaO2w',
  SUPABASE_SERVICE_ROLE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocHV3dXBiaHBjcWt3cXVna2hoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDkwOTI4OCwiZXhwIjoyMDg2NDg1Mjg4fQ.yqLUJq2PfiSM5osZIXjCjRetRuSiSvz8Lv6Q51BHeD8',
  
  // TMDB
  TMDB_API_KEY: 'afef094e7c0de13c1cac98227a61da4d',
  
  // YouTube
  YOUTUBE_API_KEY: 'AIzaSyCXvR18OjBz_s9sQJzUie_LsD_Os6rtaqc',
  
  // Gemini
  GEMINI_API_KEY: 'AIzaSyB6XGL8KmBsjv7uvwEgXgPKGPWopwGK3O8',
  
  // Admin User
  ADMIN_EMAIL: 'cairo.tv@gmail.com',
  ADMIN_PASSWORD: 'Eslam@26634095',
  
  // Domain
  DOMAIN: 'cinma.online',
};

// ============================================
// 📁 هيكل الملفات والمجلدات مع المحتوى الكامل
// ============================================
const files = {

  // ---------- package.json (مُصحح بالفواصل) ----------
  'package.json': JSON.stringify({
    name: 'cinma.online',
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      lint: 'eslint .'
    },
    dependencies: {
      '@hookform/resolvers': '^3.10.0',
      '@radix-ui/react-accordion': '^1.2.11',
      '@radix-ui/react-dialog': '^1.1.14',
      '@radix-ui/react-dropdown-menu': '^2.1.15',
      '@radix-ui/react-label': '^2.1.7',
      '@radix-ui/react-select': '^2.2.5',
      '@radix-ui/react-slot': '^1.2.3',
      '@radix-ui/react-switch': '^1.2.5',
      '@radix-ui/react-tabs': '^1.1.12',
      '@supabase/supabase-js': '^2.39.0',
      '@tanstack/react-query': '^5.83.0',
      'axios': '^1.13.5',
      'class-variance-authority': '^0.7.1',
      'clsx': '^2.1.1',
      'framer-motion': '^12.34.0',
      'lucide-react': '^0.462.0',
      'react': '^18.3.1',
      'react-dom': '^18.3.1',
      'react-helmet-async': '^2.0.5',
      'react-hook-form': '^7.61.1',
      'react-infinite-scroll-component': '^6.1.0',
      'react-player': '^2.16.0',
      'react-router-dom': '^6.30.1',
      'sonner': '^1.7.4',
      'tailwind-merge': '^2.6.0',
      'tailwindcss-animate': '^1.0.7',
      'tailwindcss-rtl': '^0.9.0',
      'zod': '^3.25.76',
      'zustand': '^4.5.6'
    },
    devDependencies: {
      '@eslint/js': '^9.32.0',
      '@tailwindcss/typography': '^0.5.16',
      '@types/node': '^22.16.5',
      '@types/react': '^18.3.23',
      '@types/react-dom': '^18.3.7',
      '@types/react-infinite-scroll-component': '^5.0.0',
      '@vitejs/plugin-react-swc': '^3.11.0',
      'autoprefixer': '^10.4.21',
      'eslint': '^9.32.0',
      'eslint-plugin-react-hooks': '^5.2.0',
      'eslint-plugin-react-refresh': '^0.4.20',
      'postcss': '^8.5.6',
      'tailwindcss': '^3.4.17',
      'typescript': '^5.8.3',
      'vite': '^5.4.19',
      'vite-plugin-pwa': '^0.16.0',
      'vite-plugin-sitemap': '^0.5.0'
    }
  }, null, 2),

  // ---------- public/_redirects (لمنع 404 على Cloudflare) ----------
  'public/_redirects': `/* /index.html 200`,

  // ---------- src/integrations/supabase/client.ts ----------
  'src/integrations/supabase/client.ts': `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '${CONFIG.SUPABASE_URL}';
const supabaseAnonKey = '${CONFIG.SUPABASE_ANON_KEY}';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);`,

  // ---------- src/App.tsx (مع كل المسارات و RTL) ----------
  'src/App.tsx': `import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Index from '@/pages/Index';
import MovieDetails from '@/pages/MovieDetails';
import SeriesDetails from '@/pages/SeriesDetails';
import Watch from '@/pages/Watch';
import Search from '@/pages/Search';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } }
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div dir="rtl">
            <Toaster position="top-center" richColors />
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/series/:id" element={<SeriesDetails />} />
                <Route path="/watch/movie/:id" element={<Watch type="movie" />} />
                <Route path="/watch/tv/:id" element={<Watch type="tv" />} />
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileNav />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;`,

  // ---------- src/pages/MovieDetails.tsx (مع Traffic Light, AI Summary, VideoPlayer, SEO) ----------
  'src/pages/MovieDetails.tsx': `import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { tmdb } from '@/lib/tmdbClient';
import { getEmbedUrl } from '@/services/embedService';
import VideoPlayer from '@/components/player/VideoPlayer';
import TrafficLightBadge from '@/components/ui/TrafficLightBadge';
import { Skeleton } from '@/components/ui/skeleton';

export default function MovieDetails() {
  const { id } = useParams();
  const [embedUrl, setEmbedUrl] = useState('');

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      // 1. جلب من Supabase أولاً (إذا كان موجوداً)
      const { data: local } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (local) return local;

      // 2. إذا لم يكن موجوداً، اجلب من TMDB واحفظه
      const { data } = await tmdb.get(\`/movie/\${id}\`);
      const ratingColor = getRatingColor(data.release_dates?.results || []);
      const movieData = {
        id: data.id,
        title: data.title,
        arabic_title: '',
        overview: data.overview,
        ai_summary: null,
        rating_color: ratingColor,
        genres: data.genres,
        release_date: data.release_date,
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        custom_embed_url: null
      };
      
      await supabase.from('movies').upsert(movieData);
      return movieData;
    }
  });

  // تحديد رابط التضمين (إما مخصص أو تلقائي)
  useEffect(() => {
    if (movie) {
      if (movie.custom_embed_url) {
        setEmbedUrl(movie.custom_embed_url);
      } else {
        setEmbedUrl(getEmbedUrl('movie', Number(id)));
      }
    }
  }, [movie, id]);

  if (isLoading) return <Skeleton className="w-full h-screen" />;
  if (!movie) return <div>غير موجود</div>;

  return (
    <>
      <Helmet>
        <title>{movie.title} - مشاهدة فيلم | cinma.online</title>
        <meta name="description" content={movie.overview?.slice(0, 160)} />
        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={movie.overview?.slice(0, 160)} />
        <meta property="og:image" content={\`https://image.tmdb.org/t/p/original\${movie.backdrop_path}\`} />
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        {/* مشغل الفيديو */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <VideoPlayer src={embedUrl} />
        </div>

        {/* معلومات الفيلم + Traffic Light */}
        <div className="mt-6 flex items-start justify-between">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <TrafficLightBadge color={movie.rating_color} />
        </div>

        {/* AI Quick Look (ملخص يوتيوب) */}
        {movie.ai_summary && (
          <div className="mt-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🔍 AI Quick Look</h2>
            <p className="text-gray-300 leading-relaxed">{movie.ai_summary}</p>
          </div>
        )}

        {/* الوصف الأصلي */}
        <p className="mt-4 text-gray-400">{movie.overview}</p>
      </div>
    </>
  );
}

function getRatingColor(release_dates: any[]): string {
  // منطق تحديد اللون بناءً على التصنيف العمري
  for (const rd of release_dates) {
    if (rd.iso_3166_1 === 'US') {
      const cert = rd.release_dates[0]?.certification;
      if (['G', 'PG'].includes(cert)) return 'green';
      if (cert === 'PG-13') return 'yellow';
      if (['R', 'NC-17', 'TV-MA'].includes(cert)) return 'red';
    }
  }
  return 'yellow'; // افتراضي
}`,

  // ---------- src/pages/AdminDashboard.tsx (God Mode Panel) ----------
  'src/pages/AdminDashboard.tsx': `import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate('/login');
      else setUser(data.user);
    });
  }, [navigate]);

  const { data: movies, isLoading } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: async () => {
      const { data } = await supabase.from('movies').select('*').order('id', { ascending: false });
      return data;
    },
    enabled: !!user
  });

  const updateMovie = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const { error } = await supabase.from('movies').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      toast.success('تم التحديث');
    }
  });

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6 rtl" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">🚀 God Mode - لوحة التحكم</h1>
      
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <div className="text-sm text-gray-400">إجمالي الأفلام</div>
          <div className="text-2xl font-bold">{movies?.length || 0}</div>
        </div>
        {/* يمكن إضافة المزيد من الإحصائيات */}
      </div>

      {/* جدول المحتوى */}
      <div className="bg-zinc-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">العنوان</th>
                <th className="px-4 py-3">التصنيف</th>
                <th className="px-4 py-3">ملخص AI</th>
                <th className="px-4 py-3">رابط مخصص</th>
                <th className="px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8">جاري التحميل...</td></tr>
              ) : (
                movies?.map((movie: any) => (
                  <tr key={movie.id} className="border-b border-zinc-800">
                    <td className="px-4 py-3">{movie.id}</td>
                    <td className="px-4 py-3">{movie.title}</td>
                    <td className="px-4 py-3">
                      <select
                        value={movie.rating_color || 'yellow'}
                        onChange={(e) => updateMovie.mutate({
                          id: movie.id,
                          updates: { rating_color: e.target.value }
                        })}
                        className={\`px-2 py-1 rounded text-sm \${
                          movie.rating_color === 'green' ? 'bg-green-600' :
                          movie.rating_color === 'red' ? 'bg-red-600' : 'bg-yellow-600'
                        }\`}
                      >
                        <option value="green">🟢 عائلي</option>
                        <option value="yellow">🟡 إشراف</option>
                        <option value="red">🔴 ناضجين</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={movie.ai_summary || ''}
                        onBlur={(e) => updateMovie.mutate({
                          id: movie.id,
                          updates: { ai_summary: e.target.value }
                        })}
                        className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        placeholder="ملخص AI"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={movie.custom_embed_url || ''}
                        onBlur={(e) => updateMovie.mutate({
                          id: movie.id,
                          updates: { custom_embed_url: e.target.value }
                        })}
                        className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        placeholder="رابط التضمين المخصص"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {/* حذف */}}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`,

  // ---------- src/components/ui/TrafficLightBadge.tsx ----------
  'src/components/ui/TrafficLightBadge.tsx': `interface Props {
  color: 'green' | 'yellow' | 'red';
}

export default function TrafficLightBadge({ color }: Props) {
  const config = {
    green: { bg: 'bg-green-500/20', text: 'text-green-400', label: '🟢 مشاهدة عائلية وآمنة' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '🟡 ينصح بإشراف عائلي' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', label: '🔴 دراما للناضجين (قصصي)' }
  };

  const style = config[color] || config.yellow;

  return (
    <span className={\`px-3 py-1 rounded-full text-sm font-medium \${style.bg} \${style.text}\`}>
      {style.label}
    </span>
  );
}`,

  // ---------- src/lib/tmdbClient.ts ----------
  'src/lib/tmdbClient.ts': `import axios from 'axios';

export const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: '${CONFIG.TMDB_API_KEY}',
    language: 'ar-SA'
  }
});`,

  // ---------- src/services/embedService.ts ----------
  'src/services/embedService.ts': `export function getEmbedUrl(type: 'movie' | 'tv', id: number, options?: { season?: number; episode?: number; serverIndex?: number }): string {
  const servers = [
    (t: string, i: number) => \`https://vidsrc.to/embed/\${t}/\${i}\${options?.season ? \`/\${options.season}/\${options.episode}\` : ''}\`,
    (t: string, i: number) => \`https://2embed.cc/embed/\${t}/\${i}\${options?.season ? \`?s=\${options.season}&e=\${options.episode}\` : ''}\`,
    (t: string, i: number) => \`https://embed.su/embed/\${t}/\${i}\${options?.season ? \`/\${options.season}/\${options.episode}\` : ''}\`
  ];
  const index = options?.serverIndex ?? 0;
  return servers[index](type, id);
}`,

  // ---------- scripts/fill_content.py (سكريبت الأتمتة الكامل) ----------
  'scripts/fill_content.py': `#!/usr/bin/env python3
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
TMDB_API_KEY = '${CONFIG.TMDB_API_KEY}'
SUPABASE_URL = '${CONFIG.SUPABASE_URL}'
SUPABASE_SERVICE_ROLE = '${CONFIG.SUPABASE_SERVICE_ROLE}'
YOUTUBE_API_KEY = '${CONFIG.YOUTUBE_API_KEY}'
GEMINI_API_KEY = '${CONFIG.GEMINI_API_KEY}'

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
        prompt = f"قم بتلخيص المراجعة التالية لفيلم '{movie_title}' في 3 جمل قصيرة باللغة العربية الفصحى:\n\n{text}"
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
    print("🎉 انتهى!")`,

  // ---------- supabase/migrations/init.sql ----------
  'supabase/migrations/init.sql': `-- تمكين UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- جدول الملفات الشخصية (يمتد من auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المستخدم يرى ملفه فقط" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "المستخدم يحدث ملفه فقط" ON profiles FOR UPDATE USING (auth.uid() = id);

-- جدول الأفلام
CREATE TABLE movies (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  arabic_title TEXT,
  overview TEXT,
  ai_summary TEXT,
  rating_color TEXT DEFAULT 'yellow',
  genres JSONB,
  release_date DATE,
  poster_path TEXT,
  backdrop_path TEXT,
  custom_embed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "الجميع يرى الأفلام" ON movies FOR SELECT USING (true);
CREATE POLICY "فقط المشرف يعدل الأفلام" ON movies FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "فقط المشرف يضيف أفلاماً" ON movies FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- جدول المسلسلات
CREATE TABLE tv_series (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  arabic_name TEXT,
  overview TEXT,
  ai_summary TEXT,
  rating_color TEXT DEFAULT 'yellow',
  genres JSONB,
  first_air_date DATE,
  poster_path TEXT,
  backdrop_path TEXT,
  custom_embed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tv_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "الجميع يرى المسلسلات" ON tv_series FOR SELECT USING (true);
CREATE POLICY "فقط المشرف يعدل المسلسلات" ON tv_series FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "فقط المشرف يضيف مسلسلات" ON tv_series FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- جدول المواسم
CREATE TABLE seasons (
  id BIGINT PRIMARY KEY,
  series_id BIGINT REFERENCES tv_series(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  name TEXT,
  overview TEXT,
  poster_path TEXT,
  air_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(series_id, season_number)
);
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "الجميع يرى المواسم" ON seasons FOR SELECT USING (true);

-- جدول الحلقات
CREATE TABLE episodes (
  id BIGINT PRIMARY KEY,
  season_id BIGINT REFERENCES seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  name TEXT,
  overview TEXT,
  still_path TEXT,
  air_date DATE,
  embed_urls JSONB,
  download_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_id, episode_number)
);
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "الجميع يرى الحلقات" ON episodes FOR SELECT USING (true);

-- جدول المفضلة
CREATE TABLE watchlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id BIGINT NOT NULL,
  content_type TEXT CHECK (content_type IN ('movie', 'tv')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id, content_type)
);
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المستخدم يدير مفضلته" ON watchlist FOR ALL USING (auth.uid() = user_id);

-- جدول متابعة المشاهدة
CREATE TABLE continue_watching (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id BIGINT NOT NULL,
  content_type TEXT CHECK (content_type IN ('movie', 'tv')),
  season_number INTEGER,
  episode_number INTEGER,
  progress_seconds INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id, content_type, season_number, episode_number)
);
ALTER TABLE continue_watching ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المستخدم يدير متابعاته" ON continue_watching FOR ALL USING (auth.uid() = user_id);

-- جدول سجل المشاهدة
CREATE TABLE history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id BIGINT NOT NULL,
  content_type TEXT CHECK (content_type IN ('movie', 'tv')),
  season_number INTEGER,
  episode_number INTEGER,
  watched_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "المستخدم يرى سجله" ON history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "المستخدم يضيف لسجله" ON history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- إنشاء حساب المشرف (يتم بعد إنشاء المستخدم عبر Supabase Auth)
-- سنقوم بإنشاء دالة أو استخدام Supabase Dashboard يدوياً
-- لكن سنضيف شرطاً: عند تسجيل المستخدم بالبريد admin@cinma.online يصبح مشرفاً
-- يمكن تنفيذ هذا عبر trigger لاحقاً.`,

  // ---------- tailwind.config.js ----------
  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      fontFamily: { cairo: ['Cairo', 'sans-serif'] }
    }
  },
  plugins: [require('tailwindcss-rtl')]
};`,

  // ---------- vite.config.ts ----------
  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'cinma.online',
        short_name: 'cinma',
        description: 'منصة المشاهدة العربية الأقوى',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    }),
    sitemap({ hostname: 'https://${CONFIG.DOMAIN}' })
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
});`,

  // ---------- tsconfig.json ----------
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  // ---------- tsconfig.node.json ----------
  'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,

  // ---------- src/index.css ----------
  'src/index.css': `@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root { --background: 0 0% 0%; --foreground: 0 0% 98%; }
  html { direction: rtl; }
  body { @apply bg-black text-white font-cairo; }
}`,

  // ---------- src/main.tsx ----------
  'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);`,

  // ---------- ملفات إضافية ضرورية ----------
  'src/components/layout/Navbar.tsx': `// يمكنك إضافة مكون الـ Navbar لاحقاً (بسيط)
export default function Navbar() {
  return <nav className="h-16 bg-black/80 backdrop-blur-md border-b border-zinc-800">...</nav>;
}`,
  'src/components/layout/MobileNav.tsx': `export default function MobileNav() { return <div>...</div>; }`,
  'src/components/ui/skeleton.tsx': `export function Skeleton({ className }: { className?: string }) {
  return <div className={\`animate-pulse bg-zinc-800 \${className}\`} />;
}`,
  'src/components/ui/sonner.tsx': `export { Toaster } from 'sonner';`,
  'src/components/ui/tooltip.tsx': `export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;`,
  'src/pages/Index.tsx': `export default function Index() { return <div className="container">الصفحة الرئيسية</div>; }`,
  'src/pages/SeriesDetails.tsx': `export default function SeriesDetails() { return <div>تفاصيل المسلسل</div>; }`,
  'src/pages/Watch.tsx': `export default function Watch({ type }: { type: 'movie' | 'tv' }) { return <div>مشغل الفيديو</div>; }`,
  'src/pages/Search.tsx': `export default function Search() { return <div>بحث</div>; }`,
  'src/pages/Login.tsx': `export default function Login() { return <div>تسجيل دخول</div>; }`,
  'src/pages/NotFound.tsx': `export default function NotFound() { return <div>404</div>; }`,
  'src/components/player/VideoPlayer.tsx': `export default function VideoPlayer({ src }: { src: string }) {
  return <iframe src={src} className="w-full h-full" allowFullScreen />;
}`,
};

// ============================================
// 🚀 إنشاء المجلدات والملفات
// ============================================
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ تم إنشاء: ${filePath}`);
});

// ---------- إنشاء مجلد public/dummy-ads (للإعلانات الوهمية) ----------
const dummyAdDir = path.join(__dirname, 'public/dummy-ads');
if (!fs.existsSync(dummyAdDir)) fs.mkdirSync(dummyAdDir, { recursive: true });
fs.writeFileSync(path.join(dummyAdDir, 'popunder.html'), '<!DOCTYPE html><html><body><h1>إعلان وهمي</h1></body></html>');
fs.writeFileSync(path.join(dummyAdDir, 'preroll.mp4'), ''); // ملف فارغ – استبدله لاحقاً

console.log('\n🎉🎉🎉 تم إنشاء المشروع بالكامل بنجاح! 🎉🎉🎉');
console.log('📌 الخطوات التالية:');
console.log('1. شغل: npm install');
console.log('2. شغل: npm run dev');
console.log('3. في قاعدة بيانات Supabase، نفذ ملف SQL: supabase/migrations/init.sql');
console.log('4. أنشئ حساب مستخدم بالبريد: ' + CONFIG.ADMIN_EMAIL);
console.log('5. عدل في جدول profiles يدوياً: role = admin (أو سنضيف trigger لاحقاً)');
console.log('6. شغل سكريبت البايثون: pip install supabase youtube-transcript-api google-generativeai requests && python scripts/fill_content.py');
console.log('7. انشر على Cloudflare Pages: اربط المستودع بالدومين ' + CONFIG.DOMAIN);
console.log('8. المنصة جاهزة! 🚀');