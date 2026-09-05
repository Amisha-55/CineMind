import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authApi, RegisterPayload, LoginPayload } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  clearAuthError: () => void;
}

const STORAGE_KEYS = {
  TOKEN: 'cinemind_token',
  USER: 'cinemind_user',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verify JWT session on initial application load
  const verifySession = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
      } else {
        throw new Error('Session invalid');
      }
    } catch {
      // Invalid/expired token -> clear auth state
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Login handler
  const login = async (payload: LoginPayload): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await authApi.login(payload);
      if (res.success && res.access_token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.access_token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
        setUser(res.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      return false;
    }
  };

  // Registration handler
  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await authApi.register(payload);
      if (res.success && res.access_token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.access_token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
        setUser(res.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. Please check your information.';
      setAuthError(msg);
      return false;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        authError,
        login,
        register,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
