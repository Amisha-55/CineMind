export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at?: string | null;
}

export interface AuthResponse {
  success: boolean;
  access_token: string;
  token_type: string;
  user: User;
}

export interface CastMember {
  id?: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
}

export interface CrewMember {
  id?: number;
  name: string;
  job?: string;
  department?: string;
  profile_path?: string | null;
}

export interface Movie {
  movie_id: number;
  title: string;
  genres: string;
  genres_list?: string[];
  tmdb_id: number;
  quality_score: number;
  year?: number;
  original_title?: string | null;
  overview?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
  vote_count?: number | null;
  popularity?: number | null;
  runtime?: number | null;
  tagline?: string | null;
  cast?: Array<CastMember | string>;
  crew?: Array<CrewMember | string>;
  poster_path?: string;
  backdrop_path?: string;
}

export interface RecommendationMovie extends Movie {
  content_score?: number;
  quality_score: number;
  final_score: number;
  match_reasons?: string[];
}

export interface UserRating {
  movie_id: number;
  rating: number; // 1 to 5
  timestamp: number;
  movie_title?: string;
  genres?: string;
}

export interface WatchlistItem {
  movie: Movie;
  added_at: number;
  status: 'want_to_watch' | 'watched';
  user_rating?: number;
}

export interface TasteActor {
  name: string;
  score: number;
  count: number;
  avg_rating: number;
  movies: string[];
  character?: string;
  profile_path?: string | null;
}

export interface TasteDirector {
  name: string;
  score: number;
  count: number;
  avg_rating: number;
  movies: string[];
}

export interface TasteProfile {
  total_rated: number;
  average_rating: number;
  genre_distribution: Record<string, number>;
  top_genres: { genre: string; count: number; percentage: number }[];
  top_actors: TasteActor[];
  top_directors: TasteDirector[];
  taste_archetype: string;
  taste_description: string;
  dynamic_summary: string;
  rated_movies: Record<number, number>; // movie_id -> rating
  is_hydrating?: boolean;
}

export interface MoodPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: string;
  genres: string[];
  accentColor: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface MoviesApiResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  movies: Movie[];
}

export interface RecommendApiResponse {
  success: boolean;
  count: number;
  recommendations: RecommendationMovie[];
}
