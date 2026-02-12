import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentItem, imgUrl, GENRES } from '@/types/content';

interface ContentCardProps {
  item: ContentItem;
  index?: number;
}

const ContentCard = ({ item, index = 0 }: ContentCardProps) => {
  const [imgError, setImgError] = useState(false);
  const title = item.title || item.name || '';
  const poster = imgUrl(item.poster_path, 'w342');
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const url = type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`;
  const genre = item.genre_ids?.[0] ? GENRES[item.genre_ids[0]] : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={url} className="block group">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden card-hover cinema-shadow bg-card">
          {/* Poster */}
          {poster && !imgError ? (
            <img
              src={poster}
              alt={title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center gap-2 p-4">
              <Film className="w-10 h-10 text-muted-foreground" />
              <span className="text-xs text-muted-foreground text-center font-medium line-clamp-2">{title}</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div>
              <p className="text-sm font-bold text-foreground line-clamp-1">{title}</p>
              {genre && <span className="text-[10px] text-primary">{genre}</span>}
            </div>
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center cinema-shadow">
              <Play className="w-5 h-5 fill-primary-foreground text-primary-foreground ms-0.5" />
            </div>
          </div>

          {/* Rating Badge */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 start-2 flex items-center gap-1 px-2 py-0.5 rounded-md glass text-[10px] font-bold">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span className="text-foreground">{item.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-2 end-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-accent/80 text-accent-foreground">
            {type === 'movie' ? 'فيلم' : 'مسلسل'}
          </div>
        </div>

        {/* Title Below */}
        <h3 className="mt-2 text-sm font-semibold text-foreground line-clamp-1">{title}</h3>
        <p className="text-xs text-muted-foreground">
          {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)}
          {genre && ` • ${genre}`}
        </p>
      </Link>
    </motion.div>
  );
};

export default ContentCard;
