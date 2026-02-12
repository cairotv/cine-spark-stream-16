import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Star, Calendar, Tag, Tv } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSeriesDetails } from '@/hooks/useContent';
import { imgUrl, GENRES } from '@/types/content';
import VideoPlayer from '@/components/player/VideoPlayer';
import SeasonEpisodes from '@/components/series/SeasonEpisodes';
import ContentCard from '@/components/content/ContentCard';

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: series, isLoading } = useSeriesDetails(Number(id));
  const [activeSeason, setActiveSeason] = useState(1);
  const [activeEpisode, setActiveEpisode] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">لم يتم العثور على المسلسل</p>
        <Link to="/" className="text-primary hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  const title = series.name || series.title || '';
  const backdrop = imgUrl(series.backdrop_path, 'original');
  const poster = imgUrl(series.poster_path, 'w500');
  const genres = series.genres?.map((g: any) => GENRES[g.id] || g.name).filter(Boolean) || series.genre_ids?.map((id: number) => GENRES[id]).filter(Boolean) || [];
  const seasons = series.seasons || [];
  const recommendations = series.recommendations?.results?.slice(0, 8) || [];

  const handleEpisodeSelect = (season: number, episode: number) => {
    setActiveSeason(season);
    setActiveEpisode(episode);
  };

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
          {poster && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-none w-48 md:w-56">
              <img src={poster} alt={title} className="w-full rounded-xl cinema-shadow" />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Tv className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary font-medium">مسلسل</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-foreground mb-3">{title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className="flex items-center gap-1 text-primary font-bold">
                <Star className="w-4 h-4 fill-primary" />
                {series.vote_average?.toFixed(1)}
              </span>
              {series.first_air_date && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {series.first_air_date.slice(0, 4)}
                </span>
              )}
              {series.number_of_seasons && (
                <span className="text-muted-foreground">{series.number_of_seasons} مواسم</span>
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

            <p className="text-foreground/70 leading-relaxed mb-6">{series.overview}</p>
          </motion.div>
        </div>

        {/* Player */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-6 rounded-full bg-primary" />
            المشاهدة - الموسم {activeSeason} الحلقة {activeEpisode}
          </h2>
          <VideoPlayer type="tv" tmdbId={Number(id)} season={activeSeason} episode={activeEpisode} title={`${title} - م${activeSeason} ح${activeEpisode}`} />
        </motion.div>

        {/* Seasons & Episodes */}
        {seasons.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-primary" />
              المواسم والحلقات
            </h2>
            <SeasonEpisodes
              seriesId={Number(id)}
              seasons={seasons}
              onEpisodeSelect={handleEpisodeSelect}
              activeSeason={activeSeason}
              activeEpisode={activeEpisode}
            />
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-primary" />
              مسلسلات مشابهة
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
              {recommendations.map((item: any, i: number) => (
                <ContentCard key={item.id} item={{ ...item, media_type: 'tv' }} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default SeriesDetails;
