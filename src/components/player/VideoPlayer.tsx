import { useState, useEffect } from 'react';
import { Play, X, Download, Monitor } from 'lucide-react';
import { EMBED_SERVERS, getEmbedUrl } from '@/types/content';

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  tmdbId: number;
  season?: number;
  episode?: number;
  title: string;
}

const VideoPlayer = ({ type, tmdbId, season, episode, title }: VideoPlayerProps) => {
  const [activeServer, setActiveServer] = useState(0);
  const [showAd, setShowAd] = useState(true);
  const [adTimer, setAdTimer] = useState(5);
  const [started, setStarted] = useState(false);

  const embedUrl = getEmbedUrl(activeServer, type, tmdbId, season, episode);

  useEffect(() => {
    if (!started || !showAd) return;
    if (adTimer <= 0) { setShowAd(false); return; }
    const t = setTimeout(() => setAdTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [adTimer, showAd, started]);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <div className="space-y-4">
      {/* Server Tabs */}
      <div className="flex flex-wrap gap-2">
        {EMBED_SERVERS.map((server, i) => (
          <button
            key={server.key}
            onClick={() => { setActiveServer(i); setShowAd(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              i === activeServer
                ? 'bg-primary text-primary-foreground cinema-shadow'
                : 'glass text-foreground/70 hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Monitor className="w-4 h-4 inline-block me-2" />
            {server.name}
          </button>
        ))}
      </div>

      {/* Player Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-card cinema-shadow">
        {/* Pre-start Screen */}
        {!started && (
          <div className="absolute inset-0 z-20 bg-card flex flex-col items-center justify-center gap-4">
            <button
              onClick={handleStart}
              className="w-20 h-20 rounded-full bg-primary flex items-center justify-center animate-pulse_gold"
            >
              <Play className="w-8 h-8 fill-primary-foreground text-primary-foreground ms-1" />
            </button>
            <p className="text-foreground font-bold text-lg">{title}</p>
            <p className="text-muted-foreground text-sm">اضغط للمشاهدة</p>
          </div>
        )}

        {/* Pre-roll Ad */}
        {started && showAd && (
          <div className="absolute inset-0 z-10 bg-card flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-black text-primary">{adTimer}</span>
              </div>
              <p className="text-foreground font-semibold mb-1">الإعلان ينتهي قريباً</p>
              <p className="text-muted-foreground text-sm">يمكنك تخطي الإعلان بعد انتهاء العد التنازلي</p>
            </div>
            {adTimer <= 0 && (
              <button
                onClick={() => setShowAd(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold"
              >
                <X className="w-4 h-4" />
                تخطي الإعلان
              </button>
            )}
          </div>
        )}

        {/* Video Iframe */}
        {started && !showAd && (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          />
        )}
      </div>

      {/* Download Section */}
      <div className="glass rounded-xl p-4">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          روابط التحميل
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {['1080p', '720p', '480p'].map(quality => (
            <button
              key={quality}
              onClick={() => {
                window.open('about:blank', '_blank');
              }}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary hover:bg-primary/10 border border-border hover:border-primary/30 transition-all text-sm"
            >
              <span className="font-medium text-foreground">{quality}</span>
              <span className="text-primary font-bold text-xs">تحميل</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
