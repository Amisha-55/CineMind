import { apiRequest } from './client';
import { Movie, RecommendationMovie, MoviesApiResponse, RecommendApiResponse } from '../types';

export interface GetMoviesParams {
  query?: string;
  genre?: string;
  mood?: string;
  min_rating?: number;
  min_year?: number;
  max_year?: number;
  sort_by?: 'popular' | 'quality' | 'year_desc' | 'year_asc' | 'title';
  page?: number;
  limit?: number;
}

export const movieApi = {
  // Check health and server status
  async checkHealth(): Promise<{ name: string; version: string; recommender_loaded: boolean; total_movies: number }> {
    return apiRequest<{ name: string; version: string; recommender_loaded: boolean; total_movies: number }>('/');
  },

  // Get curated onboarding movies
  async getOnboardingCatalog(): Promise<{ success: boolean; movies: Movie[] }> {
    return apiRequest<{ success: boolean; movies: Movie[] }>('/onboarding-catalog');
  },

  // Get list of genres
  async getGenres(): Promise<{ success: boolean; genres: string[] }> {
    return apiRequest<{ success: boolean; genres: string[] }>('/genres');
  },

  // Search & filter movies catalog
  async getMovies(params: GetMoviesParams = {}): Promise<MoviesApiResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('query', params.query);
    if (params.genre && params.genre !== 'All') queryParams.append('genre', params.genre);
    if (params.mood) queryParams.append('mood', params.mood);
    if (params.min_rating !== undefined) queryParams.append('min_rating', params.min_rating.toString());
    if (params.min_year !== undefined) queryParams.append('min_year', params.min_year.toString());
    if (params.max_year !== undefined) queryParams.append('max_year', params.max_year.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/movies?${queryString}` : '/movies';
    return apiRequest<MoviesApiResponse>(endpoint);
  },

  // Get single movie detail
  async getMovie(movieId: number): Promise<{ success: boolean; movie: Movie }> {
    return apiRequest<{ success: boolean; movie: Movie }>(`/movies/${movieId}`);
  },

  // Get similar movies via ML TF-IDF
  async getSimilarMovies(movieId: number, limit = 6): Promise<{ success: boolean; movie_id: number; similar: RecommendationMovie[] }> {
    return apiRequest<{ success: boolean; movie_id: number; similar: RecommendationMovie[] }>(`/movies/${movieId}/similar?limit=${limit}`);
  },

  // Core Hybrid ML Recommendations
  async getRecommendations(ratings: Record<number, number>): Promise<RecommendApiResponse> {
    return apiRequest<RecommendApiResponse>('/recommend', {
      method: 'POST',
      body: JSON.stringify({ ratings }),
    });
  }
};
