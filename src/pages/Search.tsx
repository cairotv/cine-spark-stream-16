import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Film, Tv, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearch, usePopularMovies, usePopularSeries } from '@/hooks/useContent';
import ContentCard from '@/components/content/ContentCard';
import { GENRES, type ContentItem } from '@/types/content';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || 'all';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const { data: searchResults, isLoading } = useSearch(debouncedQuery);
  const { data: popularMovies } = usePopularMovies();
  const { data: popularSeries } = usePopularSeries();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const allContent = debouncedQuery.length >= 2
    ? searchResults || []
    : typeFilter === 'movie'
      ? popularMovies || []
      : typeFilter === 'tv'
        ? popularSeries || []
        : [...(popularMovies || []).slice(0, 5), ...(popularSeries || []).slice(0, 5)];

  const filtered = allContent.filter((item: ContentItem) => {
    if (typeFilter === 'all') return true;
    const itemType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    return itemType === typeFilter;
  });

  const setType = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type === 'all') params.delete('type');
    else params.set('type', type);
    setSearchParams(params);
  };

  return (
    <main className="min-h-screen pt-20 pb-20 md:pb-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-4">
            {debouncedQuery ? `نتائج البحث: "${debouncedQuery}"` : typeFilter === 'movie' ? 'تصفح الأفلام' : typeFilter === 'tv' ? 'تصفح المسلسلات' : 'اكتشف'}
          </h1>

          {/* Search Input */}
          <div className="relative mb-4">
            <SearchIcon className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ابحث عن فيلم أو مسلسل..."
              className="w-full h-12 ps-12 pe-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            {[
              { key: 'all', label: 'الكل', icon: null },
              { key: 'movie', label: 'أفلام', icon: Film },
              { key: 'tv', label: 'مسلسلات', icon: Tv },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setType(opt.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === opt.key
                    ? 'bg-primary text-primary-foreground'
                    : 'glass text-foreground/70 hover:text-foreground'
                }`}
              >
                {opt.icon && <opt.icon className="w-4 h-4" />}
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] rounded-xl bg-secondary animate-pulse" />
                <div className="mt-2 h-4 w-3/4 rounded bg-secondary animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
            {filtered.map((item: ContentItem, i: number) => (
              <ContentCard key={item.id} item={{ ...item, media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie') }} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">لا توجد نتائج</p>
            <p className="text-sm text-muted-foreground/60 mt-1">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Search;
