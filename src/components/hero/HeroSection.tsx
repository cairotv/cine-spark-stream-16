import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem, imgUrl, GENRES } from '@/types/content';

interface HeroSectionProps {
  items: ContentItem[];
}

const HeroSection = ({ items }: HeroSectionProps) => {
  const [current, setCurrent] = useState(0);
  const featured = items.slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % featured.length), 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!featured.length) return null;
  const item = featured[current];
  const title = item.title || item.name || '';
  const backdrop = imgUrl(item.backdrop_path, 'original');
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const detailUrl = type === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`;
  const genres = item.genre_ids?.slice(0, 3).map(id => GENRES[id]).filter(Boolean) || [];

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {backdrop ? (
            <img
              src={backdrop}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-background" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/80" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-24 md:pb-32">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              {/* Type Badge */}
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold rounded-full bg-primary/20 text-primary border border-primary/30">
                {type === 'movie' ? '🎬 فيلم' : '📺 مسلسل'}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight text-foreground">
                {title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <span className="flex items-center gap-1 text-primary font-bold">
                  <Star className="w-4 h-4 fill-primary" />
                  {item.vote_average?.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)}
                </span>
                {genres.map(g => (
                  <span key={g} className="px-2 py-0.5 rounded-full bg-secondary text-foreground/70 text-xs">
                    {g}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                {item.overview}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  to={detailUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all cinema-shadow"
                >
                  <Play className="w-5 h-5 fill-current" />
                  شاهد الآن
                </Link>
                <Link
                  to={detailUrl}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass text-foreground font-medium text-sm hover:bg-secondary/80 transition-all"
                >
                  <Info className="w-4 h-4" />
                  التفاصيل
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          {featured.length > 1 && (
            <div className="flex items-center gap-2 mt-8">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-primary' : 'w-4 bg-foreground/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
