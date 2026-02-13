import { Play, Clock, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import { imgUrl, type Season, type Episode } from '@/types/content';
import { useSeasonEpisodes } from '@/hooks/useContent';

interface SeasonEpisodesProps {
  seriesId: number;
  seasons: Season[];
  onEpisodeSelect: (season: number, episode: number) => void;
  activeSeason: number;
  activeEpisode: number;
}

const SeasonEpisodes = ({ seriesId, seasons, onEpisodeSelect, activeSeason, activeEpisode }: SeasonEpisodesProps) => {
  const validSeasons = seasons.filter(s => s.season_number > 0);
  const { data: seasonData, isLoading } = useSeasonEpisodes(seriesId, activeSeason);
  const episodes: Episode[] = seasonData?.episodes || [];

  return (
    <div className="space-y-4">
      {/* Season Selector */}
      <div className="flex flex-wrap gap-2">
        {validSeasons.map(season => (
          <button
            key={season.season_number}
            onClick={() => onEpisodeSelect(season.season_number, 1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSeason === season.season_number
                ? 'bg-primary text-primary-foreground cinema-shadow'
                : 'glass text-foreground/70 hover:text-foreground'
            }`}
          >
            {season.name || `الموسم ${season.season_number}`}
          </button>
        ))}
      </div>

      {/* Episodes Grid */}
      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-secondary animate-pulse" />
            ))
          : episodes.map((ep, i) => {
              const isActive = ep.episode_number === activeEpisode;
              const still = imgUrl(ep.still_path, 'w300');

              return (
                <motion.button
                  key={ep.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onEpisodeSelect(activeSeason, ep.episode_number)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-start ${
                    isActive
                      ? 'bg-primary/10 border border-primary/30'
                      : 'glass hover:bg-secondary/80'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative flex-none w-28 h-16 rounded-lg overflow-hidden bg-secondary">
                    {still ? (
                      <img src={still} alt={ep.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Play className="w-5 h-5 fill-primary text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">
                      {ep.episode_number}. {ep.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ep.overview}</p>
                    {ep.runtime && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {ep.runtime} دقيقة
                      </div>
                    )}
                  </div>

                  {/* Episode Number */}
                  <span className="flex-none text-lg font-black text-muted-foreground/30">
                    {String(ep.episode_number).padStart(2, '0')}
                  </span>
                </motion.button>
              );
            })}
      </div>
    </div>
  );
};

export default SeasonEpisodes;
