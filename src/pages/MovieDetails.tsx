import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMovieDetails } from '@/hooks/useContent';
import { imgUrl, GENRES } from '@/types/content';
import VideoPlayer from '@/components/player/VideoPlayer';
import ContentCard from '@/components/content/ContentCard';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading } = useMovieDetails(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">لم يتم العثور على الفيلم</p>
        <Link to="/" className="text-primary hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  const title = movie.title || movie.name || '';
  const backdrop = imgUrl(movie.backdrop_path, 'original');
  const poster = imgUrl(movie.poster_path, 'w500');
  const genres = movie.genres?.map((g: any) => GENRES[g.id] || g.name).filter(Boolean) || movie.genre_ids?.map((id: number) => GENRES[id]).filter(Boolean) || [];
  const recommendations = movie.recommendations?.results?.slice(0, 8) || [];

  return (
    <main className="min-h-screen pb-20">
      {/* Backdrop */}
      <div className="relative h-[50vh] md:h-[60vh]">
        {backdrop ? (
          <img src={backdrop} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-background" />
        )}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 start-4">
          <Link to="/" className="inline-flex items-center gap-2 glass px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground transition-colors">
            <ArrowRight className="w-4 h-4" />
            رجوع
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          {poster && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-none w-48 md:w-56"
            >
              <img src={poster} alt={title} className="w-full rounded-xl cinema-shadow" />
            </motion.div>
          )}

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <h1 className="text-2xl md:text-4xl font-black text-foreground mb-3">{title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className="flex items-center gap-1 text-primary font-bold">
                <Star className="w-4 h-4 fill-primary" />
                {movie.vote_average?.toFixed(1)}
              </span>
              {movie.release_date && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {movie.release_date.slice(0, 4)}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {movie.runtime} دقيقة
                </span>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((g: string) => (
                  <span key={g} className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground/70">
                    <Tag className="w-3 h-3" />
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="text-foreground/70 leading-relaxed mb-6">{movie.overview}</p>
          </motion.div>
        </div>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-6 rounded-full bg-primary" />
            مشاهدة الفيلم
          </h2>
          <VideoPlayer type="movie" tmdbId={Number(id)} title={title} />
        </motion.div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-primary" />
              أفلام مشابهة
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
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
