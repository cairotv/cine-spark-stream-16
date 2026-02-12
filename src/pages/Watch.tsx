import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/lib/tmdbClient";
import { getEmbedUrl, getDownloadLinks } from "@/services/embedService";
import VideoPlayer from "@/components/player/VideoPlayer";
import ServerTabs from "@/components/player/ServerTabs";
import QualitySelector from "@/components/player/QualitySelector";
import DownloadSection from "@/components/player/DownloadSection";
import PreRollAd from "@/components/player/PreRollAd";
import SeasonSelector from "@/components/series/SeasonSelector";
import EpisodeGrid from "@/components/series/EpisodeGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useAdSimulation } from "@/hooks/useAdSimulation";

interface WatchProps {
  type: "movie" | "tv";
}

export default function Watch({ type }: WatchProps) {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [showAd, setShowAd] = useState(true);
  const [adSkipped, setAdSkipped] = useState(false);

  // 🔥 استعلام بيانات الفيلم/المسلسل من TMDB
  const { data: content, isLoading } = useQuery({
    queryKey: [type, id, season, episode],
    queryFn: async () => {
      if (type === "movie") {
        const { data } = await tmdb.get(`/movie/${id}`);
        return { ...data, mediaType: "movie" };
      } else {
        const { data } = await tmdb.get(`/tv/${id}`);
        let episodeData = null;
        if (season && episode) {
          const epRes = await tmdb.get(`/tv/${id}/season/${season}/episode/${episode}`);
          episodeData = epRes.data;
        }
        return { ...data, mediaType: "tv", episode: episodeData };
      }
    },
    enabled: !!id,
  });

  // 🎬 متابعة المشاهدة (Continue Watching)
  const { saveProgress } = useContinueWatching(
    Number(id),
    type,
    season ? Number(season) : undefined,
    episode ? Number(episode) : undefined
  );

  // 📢 محاكاة الإعلانات
  const { triggerPopUnder } = useAdSimulation();

  // 🔗 توليد روابط التضمين حسب السيرفر المختار
  const embedUrl = getEmbedUrl(type, Number(id), {
    season: season ? Number(season) : undefined,
    episode: episode ? Number(episode) : undefined,
    serverIndex: selectedServer,
  });

  // ⬇️ روابط التحميل
  const downloadLinks = getDownloadLinks(type, Number(id), {
    season: season ? Number(season) : undefined,
    episode: episode ? Number(episode) : undefined,
  });

  // 🧠 تحديث عنوان الصفحة ديناميكياً
  const pageTitle = content
    ? type === "movie"
      ? `مشاهدة ${content.title} مترجم - Cinema Online`
      : `مشاهدة ${content.name} الموسم ${season} الحلقة ${episode} - Cinema Online`
    : "تحميل...";

  // ⏱️ عند انتهاء الإعلان
  const handleAdComplete = () => {
    setShowAd(false);
    setAdSkipped(true);
  };

  // ⏩ تخطي الإعلان
  const handleSkipAd = () => {
    setShowAd(false);
    setAdSkipped(true);
  };

  // 📊 حفظ التقدم كل 5 ثوان
  useEffect(() => {
    if (!adSkipped || !content) return;
    const interval = setInterval(() => {
      saveProgress(30); // افتراضي 30 ثانية (يمكنك ربطه بالمشغل الفعلي)
    }, 5000);
    return () => clearInterval(interval);
  }, [adSkipped, content, saveProgress]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full h-[400px] rounded-lg" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (!content) return <div>المحتوى غير متوفر</div>;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={content.overview?.slice(0, 160)} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={content.overview?.slice(0, 160)} />
        <meta property="og:image" content={`https://image.tmdb.org/t/p/original${content.backdrop_path}`} />
      </Helmet>

      <div className="container mx-auto px-4 py-6 rtl">
        {/* 🎬 مشغل الفيديو مع الإعلان */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {showAd && !adSkipped ? (
            <PreRollAd onComplete={handleAdComplete} onSkip={handleSkipAd} />
          ) : (
            <VideoPlayer
              src={embedUrl}
              quality={selectedQuality}
              onProgress={(progress) => saveProgress(progress)}
            />
          )}
        </div>

        {/* 🔄 علامات تبويب السيرفرات */}
        <div className="mt-4">
          <ServerTabs selected={selectedServer} onSelect={setSelectedServer} />
        </div>

        {/* ⚙️ اختيار الجودة وزر التحميل */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <QualitySelector selected={selectedQuality} onSelect={setSelectedQuality} />
          {downloadLinks.length > 0 && (
            <button
              onClick={() => {
                triggerPopUnder();
                // هنا يمكن فتح رابط التحميل بعد تأخير بسيط
                setTimeout(() => window.open(downloadLinks[0].url, "_blank"), 500);
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              تحميل
            </button>
          )}
        </div>

        {/* ⬇️ جدول روابط التحميل */}
        {downloadLinks.length > 0 && (
          <div className="mt-6">
            <DownloadSection links={downloadLinks} />
          </div>
        )}

        {/* 📺 معلومات المحتوى */}
        <div className="mt-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            {type === "movie" ? content.title : content.name}
          </h1>
          <p className="mt-2 text-gray-300 leading-relaxed">{content.overview}</p>
        </div>

        {/* 🎞️ نظام المسلسلات: اختيار الموسم وشبكة الحلقات */}
        {type === "tv" && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">الحلقات</h2>
            <SeasonSelector seriesId={Number(id)} selectedSeason={Number(season) || 1} />
            <div className="mt-6">
              <EpisodeGrid
                seriesId={Number(id)}
                seasonNumber={Number(season) || 1}
                currentEpisode={Number(episode)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
