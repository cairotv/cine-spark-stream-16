import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentItem } from '@/types/content';
import ContentCard from './ContentCard';

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  isLoading?: boolean;
}

const SkeletonCard = () => (
  <div className="flex-none w-[140px] sm:w-[160px] md:w-[180px]">
    <div className="aspect-[2/3] rounded-xl bg-secondary animate-pulse" />
    <div className="mt-2 h-4 w-3/4 rounded bg-secondary animate-pulse" />
    <div className="mt-1 h-3 w-1/2 rounded bg-secondary animate-pulse" />
  </div>
);

const ContentRow = ({ title, items, isLoading }: ContentRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="py-4 md:py-6">
      {/* Header */}
      <div className="container mx-auto px-4 flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-primary" />
          {title}
        </h2>
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary hover:bg-primary/20 text-foreground/60 hover:text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary hover:bg-primary/20 text-foreground/60 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Row */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar px-4 container mx-auto"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item, i) => (
                <div key={item.id} className="flex-none w-[140px] sm:w-[160px] md:w-[180px]">
                  <ContentCard item={item} index={i} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default ContentRow;
