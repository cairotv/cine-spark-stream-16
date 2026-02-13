import { useEffect, useState } from 'react';
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
      const { data } = await tmdb.get(`/movie/${id}`);
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
        <meta property="og:image" content={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} />
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
}