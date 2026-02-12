import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Calendar, Tag, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMovieDetails } from '@/hooks/useContent';
import { imgUrl, GENRES } from '@/types/content';
import VideoPlayer from '@/components/player/VideoPlayer';
import ContentCard from '@/components/content/ContentCard';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  // @ts-ignore
  const { data: movie, isLoading } = useMovieDetails(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-white">
        <p className="text-gray-400">لم يتم العثور على الفيلم</p>
        <Link to="/" className="text-red-500 hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  const title = movie.title || movie.name || '';
  const backdrop = imgUrl(movie.backdrop_path, 'original');
  const poster = imgUrl(movie.poster_path, 'w500');
  // معالجة الأقسام بمرونة
  const genres = movie.genres?.map((g: any) => g.name || GENRES[g.id]).filter(Boolean) || 
                 movie.genre_ids?.map((id: number) => GENRES[id]).filter(Boolean) || [];
  const recommendations = movie.recommendations?.results?.slice(0, 8) || [];

  // 🚦 منطق إشارة المرور (النظام الدبلوماسي)
  const getRatingInfo = (color: string) => {
    switch (color) {
      case 'red':
        return {
          text: 'للكبار',
          style: 'bg-red-500/10 text-red-400 border-red-500/20',
          dot: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
        };
      case 'yellow':
        return {
          text: 'شبابي',
          style: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
          dot: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]'
        };
      case 'green':
      default:
        return {
          text: 'عائلي',
          style: 'bg-green-500/10 text-green-400 border-green-500/20',
          dot: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]'
        };
    }
  };

  // نفترض اللون أخضر إذا لم يكن موجوداً
  const ratingBadge = getRatingInfo(movie.rating_color || 'green');

  return (
    <main className="min-h-screen pb-20 bg-[#0a0a0a] text-white font-sans">
      {/* Backdrop */}
      <div className="relative h-[50vh] md:h-[60vh]">
        {backdrop ? (
          <img src={backdrop} alt={title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        
        <div className="absolute top-24 start-4 z-20">
          <Link to="/" className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-colors border border-white/10">
            <ArrowRight className="w-4 h-4" />
            عودة
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-60 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {poster && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-none w-48 md:w-64 mx-auto md:mx-0 shadow-2xl shadow-black/50 rounded-xl overflow-hidden border border-white/10"
            >
              <img src={poster} alt={title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 text-center md:text-right pt-10 md:pt-20"
          >
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{title}</h1>

            {/* 🚦 كبسولة التصنيف المضيئة (الجديدة) */}
            <div className="flex justify-center md:justify-start mb-6">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md ${ratingBadge.style}`}>
                <div className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${ratingBadge.dot.split(' ')[0]}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${ratingBadge.dot}`}></span>
                </div>
                <span className="text-xs font-bold tracking-wide">{ratingBadge.text}</span>
              </div>
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm text-gray-300">
              <span className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded">
                <Star className="w-4 h-4 fill-yellow-400" />
                {movie.vote_average?.toFixed(1)}
              </span>
              
              {movie.release_date && (
                <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                  <Calendar className="w-4 h-4" />
                  {movie.release_date.slice(0, 4)}
                </span>
              )}
              
              {movie.runtime && (
                <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                  <Clock className="w-4 h-4" />
                  {movie.runtime} دقيقة
                </span>
              )}

              {/* Age Rating if exists */}
              {movie.age_rating && movie.age_rating !== 'NR' && (
                <span className="border border-white/20 px-2 py-1 rounded text-xs font-mono">
                  {movie.age_rating}
                </span>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {genres.map((g: string) => (
                  <span key={g} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-300 transition-colors cursor-pointer">
                    <Tag className="w-3 h-3" />
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-300 leading-loose text-lg max-w-3xl mb-8">{movie.overview}</p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
               <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center gap-2">
                 <VideoPlayer type="movie" tmdbId={Number(id)} title={title} trigger={<span>مشاهدة الآن</span>} />
               </button>
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-20 border-t border-white/10 pt-10"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-8 rounded-full bg-red-600" />
              قد يعجبك أيضاً
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((item: any, i: number) => (
                <ContentCard key={item.id} item={{ ...item, media_type: 'movie' }} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default MovieDetails;
