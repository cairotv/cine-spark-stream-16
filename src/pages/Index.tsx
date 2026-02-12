import HeroSection from '@/components/hero/HeroSection';
import ContentRow from '@/components/content/ContentRow';
import { useTrending, usePopularMovies, useTopRatedMovies, usePopularSeries } from '@/hooks/useContent';

const Index = () => {
  const trending = useTrending();
  const popularMovies = usePopularMovies();
  const topRatedMovies = useTopRatedMovies();
  const popularSeries = usePopularSeries();

  return (
    <main className="min-h-screen pb-20 md:pb-8">
      {/* Hero */}
      <HeroSection items={trending.data || []} />

      {/* Content Rows */}
      <div className="-mt-20 relative z-10 space-y-2">
        <ContentRow
          title="الأكثر رواجاً"
          items={trending.data || []}
          isLoading={trending.isLoading}
        />
        <ContentRow
          title="أفلام شائعة"
          items={popularMovies.data || []}
          isLoading={popularMovies.isLoading}
        />
        <ContentRow
          title="أعلى تقييماً"
          items={topRatedMovies.data || []}
          isLoading={topRatedMovies.isLoading}
        />
        <ContentRow
          title="مسلسلات رائجة"
          items={popularSeries.data || []}
          isLoading={popularSeries.isLoading}
        />
      </div>
    </main>
  );
};

export default Index;
