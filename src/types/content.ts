export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
  media_type?: 'movie';
}

export interface Series {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  number_of_seasons?: number;
  popularity: number;
  media_type?: 'tv';
  seasons?: Season[];
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  episode_count: number;
  air_date: string;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
  season_number: number;
}

export interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
  overview: string;
  genre_ids: number[];
}

export const TMDB_IMG = 'https://image.tmdb.org/t/p';

export const imgUrl = (path: string | null, size: string = 'w500') =>
  path ? `${TMDB_IMG}/${size}${path}` : null;

export const GENRES: Record<number, string> = {
  28: 'أكشن', 12: 'مغامرة', 16: 'رسوم متحركة', 35: 'كوميديا',
  80: 'جريمة', 99: 'وثائقي', 18: 'دراما', 10751: 'عائلي',
  14: 'فانتازيا', 36: 'تاريخي', 27: 'رعب', 10402: 'موسيقي',
  9648: 'غموض', 10749: 'رومانسي', 878: 'خيال علمي', 53: 'إثارة',
  10752: 'حرب', 37: 'ويسترن', 10759: 'أكشن ومغامرة', 10762: 'أطفال',
  10765: 'خيال علمي وفانتازيا', 10766: 'مسلسلات', 10768: 'حرب وسياسة',
};

export const EMBED_SERVERS = [
  { name: 'سيرفر 1 (سريع)', key: 'vidsrc' },
  { name: 'سيرفر 2 (HD)', key: '2embed' },
  { name: 'سيرفر 3 (احتياطي)', key: 'embedsu' },
];

export const getEmbedUrl = (serverIdx: number, type: 'movie' | 'tv', id: number, season?: number, episode?: number) => {
  const bases = [
    'https://vidsrc.to/embed',
    'https://2embed.cc/embed',
    'https://embed.su/embed',
  ];
  const base = bases[serverIdx] || bases[0];
  if (type === 'movie') return `${base}/movie/${id}`;
  return `${base}/tv/${id}/${season || 1}/${episode || 1}`;
};
