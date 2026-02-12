import { useQuery } from '@tanstack/react-query';
import * as api from '@/lib/tmdb';

export const useTrending = () =>
  useQuery({ queryKey: ['trending'], queryFn: api.getTrending, staleTime: 1000 * 60 * 30 });

export const usePopularMovies = () =>
  useQuery({ queryKey: ['movies', 'popular'], queryFn: api.getPopularMovies, staleTime: 1000 * 60 * 30 });

export const useTopRatedMovies = () =>
  useQuery({ queryKey: ['movies', 'top_rated'], queryFn: api.getTopRatedMovies, staleTime: 1000 * 60 * 30 });

export const usePopularSeries = () =>
  useQuery({ queryKey: ['series', 'popular'], queryFn: api.getPopularSeries, staleTime: 1000 * 60 * 30 });

export const useMovieDetails = (id: number) =>
  useQuery({ queryKey: ['movie', id], queryFn: () => api.getMovieById(id), enabled: !!id });

export const useSeriesDetails = (id: number) =>
  useQuery({ queryKey: ['series', id], queryFn: () => api.getSeriesById(id), enabled: !!id });

export const useSeasonEpisodes = (seriesId: number, seasonNum: number) =>
  useQuery({ queryKey: ['season', seriesId, seasonNum], queryFn: () => api.getSeasonEpisodes(seriesId, seasonNum), enabled: !!seriesId && seasonNum > 0 });

export const useSearch = (query: string) =>
  useQuery({ queryKey: ['search', query], queryFn: () => api.searchContent(query), enabled: query.length >= 2, staleTime: 1000 * 60 * 5 });
