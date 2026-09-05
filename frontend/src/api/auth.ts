import { apiRequest } from './client';
import { User, AuthResponse } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface MeResponse {
  success: boolean;
  user: User;
  ratings: Record<number, number>;
  watchlist: Array<{ movie_id: number; status: string }>;
}

export interface SyncPayload {
  ratings?: Record<number, number>;
  watchlist?: Array<{ movie_id: number; status: string }>;
}

export const authApi = {
  // Register a new user account
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Log in with existing credentials
  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Get currently authenticated user profile and saved data
  async getMe(): Promise<MeResponse> {
    return apiRequest<MeResponse>('/auth/me');
  },

  // Synchronize user ratings & watchlist to the backend database
  async syncUserData(payload: SyncPayload): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>('/auth/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
