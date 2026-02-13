import axios from 'axios';

export const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: 'afef094e7c0de13c1cac98227a61da4d',
    language: 'ar-SA'
  }
});