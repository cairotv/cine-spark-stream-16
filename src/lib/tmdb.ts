import axios from 'axios';
import type { ContentItem } from '@/types/content';

// TMDB API Key - Replace with your own from https://www.themoviedb.org/settings/api
const API_KEY = 'afef094e7c0de13c1cac98227a61da4d'; // Leave empty to use sample data

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: API_KEY, language: 'ar-SA' },
});

const isApiReady = () => API_KEY.length > 10;

// Real API calls
export const fetchTrending = () => tmdb.get('/trending/all/week').then(r => r.data.results);
export const fetchPopularMovies = () => tmdb.get('/movie/popular').then(r => r.data.results);
export const fetchTopRatedMovies = () => tmdb.get('/movie/top_rated').then(r => r.data.results);
export const fetchPopularSeries = () => tmdb.get('/tv/popular').then(r => r.data.results);
export const fetchTopRatedSeries = () => tmdb.get('/tv/top_rated').then(r => r.data.results);
export const fetchMovieDetails = (id: number) => tmdb.get(`/movie/${id}`, { params: { append_to_response: 'videos,recommendations' } }).then(r => r.data);
export const fetchSeriesDetails = (id: number) => tmdb.get(`/tv/${id}`, { params: { append_to_response: 'videos,recommendations' } }).then(r => r.data);
export const fetchSeasonDetails = (seriesId: number, seasonNum: number) => tmdb.get(`/tv/${seriesId}/season/${seasonNum}`).then(r => r.data);
export const searchMulti = (query: string) => tmdb.get('/search/multi', { params: { query } }).then(r => r.data.results);

// Sample data for demo
const SAMPLE_MOVIES: ContentItem[] = [
  { id: 872585, title: 'أوبنهايمر', overview: 'قصة العالم الذي قاد مشروع مانهاتن لصنع أول قنبلة ذرية في التاريخ، وكيف غيّر مصير العالم إلى الأبد.', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', vote_average: 8.1, release_date: '2023-07-19', genre_ids: [18, 36], media_type: 'movie' },
  { id: 278, title: 'الخلاص من شاوشانك', overview: 'مصرفي بريء يُحكم عليه بالسجن المؤبد ويكتشف طريقة للأمل والحرية من خلال صداقة غير متوقعة.', poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg', vote_average: 8.7, release_date: '1994-09-23', genre_ids: [18, 80], media_type: 'movie' },
  { id: 238, title: 'العرّاب', overview: 'رئيس عائلة مافيا يواجه تحديات نقل السلطة لابنه في عالم الجريمة المنظمة.', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg', vote_average: 8.7, release_date: '1972-03-14', genre_ids: [18, 80], media_type: 'movie' },
  { id: 155, title: 'فارس الظلام', overview: 'باتمان يواجه عدوه الأخطر على الإطلاق: الجوكر، في معركة مصيرية لإنقاذ مدينة جوثام.', poster_path: '/qJ2tW6WMUDux911BqAaRBxFm0CX.jpg', backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5eze.jpg', vote_average: 8.5, release_date: '2008-07-16', genre_ids: [28, 80, 18], media_type: 'movie' },
  { id: 27205, title: 'استهلال', overview: 'لص محترف يسرق الأفكار من الأحلام ويواجه مهمة مستحيلة: زرع فكرة في عقل شخص نائم.', poster_path: '/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg', backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', vote_average: 8.4, release_date: '2010-07-15', genre_ids: [28, 878, 12], media_type: 'movie' },
  { id: 157336, title: 'بين النجوم', overview: 'فريق من المستكشفين يسافر عبر ثقب دودي في الفضاء بحثاً عن موطن جديد للبشرية.', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop_path: '/xJHokMbljvjADYdit5fK1B4FmP8.jpg', vote_average: 8.4, release_date: '2014-11-05', genre_ids: [12, 18, 878], media_type: 'movie' },
  { id: 496243, title: 'طفيلي', overview: 'عائلة فقيرة تتسلل إلى حياة عائلة ثرية بطرق ماكرة ومبتكرة في هذا الفيلم الحائز على الأوسكار.', poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', backdrop_path: '/TU9aKQfFLfjsaZIfjPNulo33N4g.jpg', vote_average: 8.5, release_date: '2019-05-30', genre_ids: [35, 53, 18], media_type: 'movie' },
  { id: 438631, title: 'كثيب', overview: 'بول أتريديس ينضم لعائلته في الكوكب الصحراوي أراكيس حيث يواجه مصيره المحتوم.', poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', backdrop_path: '/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg', vote_average: 7.8, release_date: '2021-09-15', genre_ids: [878, 12], media_type: 'movie' },
  { id: 550, title: 'نادي القتال', overview: 'موظف مكتب يعاني من الأرق يبحث عن مخرج من حياته الرتيبة عبر نادٍ سري للقتال.', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', backdrop_path: '/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg', vote_average: 8.4, release_date: '1999-10-15', genre_ids: [18, 53], media_type: 'movie' },
  { id: 680, title: 'خيال رخيص', overview: 'قصص متشابكة عن الجريمة والعنف في لوس أنجلوس بأسلوب تارانتينو الفريد.', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg', vote_average: 8.5, release_date: '1994-09-10', genre_ids: [53, 80], media_type: 'movie' },
];

const SAMPLE_SERIES: ContentItem[] = [
  { id: 1396, name: 'بريكينج باد', overview: 'معلم كيمياء مصاب بالسرطان يتحول إلى أكبر تاجر مخدرات في نيو مكسيكو.', poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg', vote_average: 8.9, first_air_date: '2008-01-20', genre_ids: [18, 80], media_type: 'tv' },
  { id: 1399, name: 'صراع العروش', overview: 'عائلات نبيلة تتصارع على عرش الممالك السبع في عالم من الفانتازيا الملحمية.', poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', backdrop_path: '/suopoADq0k8YZr4dQXcU6pToj6s.jpg', vote_average: 8.4, first_air_date: '2011-04-17', genre_ids: [10765, 18], media_type: 'tv' },
  { id: 66732, name: 'أشياء غريبة', overview: 'مجموعة من الأصدقاء يواجهون قوى خارقة ومخلوقات من عالم آخر في بلدة صغيرة.', poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', backdrop_path: '/56v2KjBlYj0Qb1HiN40P8UfJPol.jpg', vote_average: 8.6, first_air_date: '2016-07-15', genre_ids: [18, 10765, 9648], media_type: 'tv' },
  { id: 94997, name: 'بيت التنين', overview: 'قصة عائلة تارجاريان وصراعاتهم الدموية على العرش الحديدي.', poster_path: '/z2yahl2uefxDCl0nogcRBstwruJ.jpg', backdrop_path: '/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg', vote_average: 8.4, first_air_date: '2022-08-21', genre_ids: [10765, 18], media_type: 'tv' },
  { id: 100088, name: 'آخر الناجين', overview: 'في عالم ما بعد الكارثة، رجل وفتاة يعبران أمريكا المدمرة بحثاً عن الأمل.', poster_path: '/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', backdrop_path: '/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg', vote_average: 8.8, first_air_date: '2023-01-15', genre_ids: [18], media_type: 'tv' },
];

// Wrapper that returns sample data if no API key
export async function getTrending(): Promise<ContentItem[]> {
  if (!isApiReady()) return [...SAMPLE_MOVIES.slice(0, 5), ...SAMPLE_SERIES.slice(0, 3)];
  return fetchTrending();
}
export async function getPopularMovies(): Promise<ContentItem[]> {
  if (!isApiReady()) return SAMPLE_MOVIES;
  return fetchPopularMovies();
}
export async function getTopRatedMovies(): Promise<ContentItem[]> {
  if (!isApiReady()) return [...SAMPLE_MOVIES].reverse();
  return fetchTopRatedMovies();
}
export async function getPopularSeries(): Promise<ContentItem[]> {
  if (!isApiReady()) return SAMPLE_SERIES;
  return fetchPopularSeries();
}
export async function getMovieById(id: number) {
  const found = SAMPLE_MOVIES.find(m => m.id === id);
  if (!isApiReady()) return found ? { ...found, genres: found.genre_ids.map(g => ({ id: g })), runtime: 148, videos: { results: [] }, recommendations: { results: SAMPLE_MOVIES.filter(m => m.id !== id).slice(0, 6) } } : null;
  return fetchMovieDetails(id);
}
export async function getSeriesById(id: number) {
  const found = SAMPLE_SERIES.find(s => s.id === id);
  if (!isApiReady()) return found ? { ...found, title: found.name, genres: found.genre_ids.map(g => ({ id: g })), number_of_seasons: 3, seasons: [
    { id: 1, season_number: 1, name: 'الموسم 1', episode_count: 10, air_date: '2020-01-01', overview: '', poster_path: found.poster_path },
    { id: 2, season_number: 2, name: 'الموسم 2', episode_count: 10, air_date: '2021-01-01', overview: '', poster_path: found.poster_path },
    { id: 3, season_number: 3, name: 'الموسم 3', episode_count: 8, air_date: '2022-01-01', overview: '', poster_path: found.poster_path },
  ], videos: { results: [] }, recommendations: { results: SAMPLE_SERIES.filter(s => s.id !== id).slice(0, 4).map(s => ({ ...s, title: s.name })) } } : null;
  return fetchSeriesDetails(id);
}
export async function getSeasonEpisodes(seriesId: number, seasonNum: number) {
  if (!isApiReady()) return { episodes: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, episode_number: i + 1, name: `الحلقة ${i + 1}`, overview: 'وصف الحلقة...', still_path: null, air_date: '2023-01-01', runtime: 50, season_number: seasonNum })) };
  return fetchSeasonDetails(seriesId, seasonNum);
}
export async function searchContent(query: string): Promise<ContentItem[]> {
  if (!isApiReady()) return [...SAMPLE_MOVIES, ...SAMPLE_SERIES].filter(i => (i.title || i.name || '').includes(query) || i.overview.includes(query));
  return searchMulti(query);
}
