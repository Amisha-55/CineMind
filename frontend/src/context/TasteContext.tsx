import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Movie, RecommendationMovie, WatchlistItem, TasteProfile, TasteActor, TasteDirector } from '../types';
import { movieApi } from '../api/movies';
import { authApi } from '../api/auth';
import { useAuth } from './AuthContext';
import { cleanMovieTitle, getCastMembers } from '../utils/movieUtils';

interface TasteContextType {
  ratings: Record<number, number>;
  ratedMoviesDetails: Record<number, Movie>;
  watchlist: WatchlistItem[];
  recommendations: RecommendationMovie[];
  isLoadingRecommendations: boolean;
  isHydratingDetails: boolean;
  recommendationError: string | null;
  hasCompletedOnboarding: boolean;
  hasPendingTasteUpdate: boolean;
  tasteProfile: TasteProfile;
  rateMovie: (movie: Movie, rating: number) => void;
  removeRating: (movieId: number) => void;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  toggleWatched: (movie: Movie) => void;
  fetchRecommendations: (customRatings?: Record<number, number>) => Promise<void>;
  completeOnboarding: (starterRatings: { movie: Movie; rating: number }[]) => Promise<void>;
  resetTasteProfile: () => void;
  clearPendingTasteUpdate: () => void;
  selectedMovieForModal: Movie | null;
  setSelectedMovieForModal: (movie: Movie | null) => void;
  selectedRecForWhyModal: RecommendationMovie | null;
  setSelectedRecForWhyModal: (rec: RecommendationMovie | null) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
}

// Default seed ratings for cold-start exploration
export const DEFAULT_SEED_RATINGS: Record<number, number> = {
  318: 5.0, // Shawshank Redemption
  858: 5.0, // The Godfather
  527: 4.5, // Schindler's List
  260: 4.5, // Star Wars IV
  296: 5.0, // Pulp Fiction
};

const TasteContext = createContext<TasteContextType | undefined>(undefined);

export const TasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const userStorageKey = useCallback((key: string) => {
    return user ? `cinemind_${key}_${user.id}` : `cinemind_${key}_guest`;
  }, [user]);

  // 1. User Ratings Store
  const [ratings, setRatings] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('cinemind_ratings_guest');
      return saved ? JSON.parse(saved) : DEFAULT_SEED_RATINGS;
    } catch {
      return DEFAULT_SEED_RATINGS;
    }
  });

  const [ratedMoviesDetails, setRatedMoviesDetails] = useState<Record<number, Movie>>(() => {
    try {
      const saved = localStorage.getItem('cinemind_rated_details_guest');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 2. Watchlist Store
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinemind_watchlist_guest');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Onboarding & Hydration Status
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [isHydratingDetails, setIsHydratingDetails] = useState<boolean>(false);

  // 4. ML Recommendations Store
  const [recommendations, setRecommendations] = useState<RecommendationMovie[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState<boolean>(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [hasPendingTasteUpdate, setHasPendingTasteUpdate] = useState<boolean>(false);

  // 5. Global Modals State
  const [selectedMovieForModal, setSelectedMovieForModal] = useState<Movie | null>(null);
  const [selectedRecForWhyModal, setSelectedRecForWhyModal] = useState<RecommendationMovie | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Fetch ML recommendations from FastAPI
  const fetchRecommendations = useCallback(async (customRatings?: Record<number, number>) => {
    const activeRatings = customRatings || ratings;
    if (Object.keys(activeRatings).length === 0) {
      setRecommendations([]);
      return;
    }

    setIsLoadingRecommendations(true);
    setRecommendationError(null);

    try {
      const res = await movieApi.getRecommendations(activeRatings);
      if (res.success && res.recommendations) {
        setRecommendations(res.recommendations);
        setHasPendingTasteUpdate(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate recommendations';
      console.warn('Recommendation fetch warning:', msg);
      setRecommendationError(msg);
    } finally {
      setIsLoadingRecommendations(false);
    }
  }, [ratings]);

  // Synchronize on authentication change (Login / Logout)
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load user's scoped preferences from localStorage / server
      try {
        const userSavedRatings = localStorage.getItem(`cinemind_ratings_${user.id}`);
        const userSavedDetails = localStorage.getItem(`cinemind_rated_details_${user.id}`);
        const userSavedWatchlist = localStorage.getItem(`cinemind_watchlist_${user.id}`);

        if (userSavedDetails) {
          try {
            setRatedMoviesDetails(JSON.parse(userSavedDetails));
          } catch (e) {
            console.warn('Error parsing cached user movie details', e);
          }
        }

        if (userSavedRatings) {
          const parsedRatings = JSON.parse(userSavedRatings);
          setRatings(parsedRatings);
          fetchRecommendations(parsedRatings);
        } else {
          // Check backend server sync
          authApi.getMe().then(res => {
            if (res.success && res.ratings && Object.keys(res.ratings).length > 0) {
              setRatings(res.ratings);
              localStorage.setItem(`cinemind_ratings_${user.id}`, JSON.stringify(res.ratings));
              fetchRecommendations(res.ratings);
            } else {
              // Save default seeds for new user
              localStorage.setItem(`cinemind_ratings_${user.id}`, JSON.stringify(ratings));
              authApi.syncUserData({ ratings });
              fetchRecommendations(ratings);
            }
          }).catch(() => {});
        }

        if (userSavedWatchlist) {
          setWatchlist(JSON.parse(userSavedWatchlist));
        }
      } catch (err) {
        console.warn('Error loading user taste state', err);
      }
    } else {
      // User logged out -> reset to guest state
      try {
        const guestRatings = localStorage.getItem('cinemind_ratings_guest');
        const guestDetails = localStorage.getItem('cinemind_rated_details_guest');
        const initial = guestRatings ? JSON.parse(guestRatings) : DEFAULT_SEED_RATINGS;
        setRatings(initial);
        setRatedMoviesDetails(guestDetails ? JSON.parse(guestDetails) : {});
        setWatchlist([]);
        fetchRecommendations(initial);
      } catch {
        setRatings(DEFAULT_SEED_RATINGS);
        setRatedMoviesDetails({});
        fetchRecommendations(DEFAULT_SEED_RATINGS);
      }
    }
  }, [isAuthenticated, user?.id]);

  // Persist ratings whenever updated
  useEffect(() => {
    try {
      const key = userStorageKey('ratings');
      localStorage.setItem(key, JSON.stringify(ratings));

      // Background sync to backend database if authenticated
      if (isAuthenticated && user) {
        authApi.syncUserData({ ratings }).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to save ratings', e);
    }
  }, [ratings, isAuthenticated, user, userStorageKey]);

  // Persist rated movies details whenever updated
  useEffect(() => {
    try {
      const key = userStorageKey('rated_details');
      localStorage.setItem(key, JSON.stringify(ratedMoviesDetails));
    } catch (e) {
      console.error('Failed to save rated details', e);
    }
  }, [ratedMoviesDetails, user, userStorageKey]);

  // Persist watchlist whenever updated
  useEffect(() => {
    try {
      const key = userStorageKey('watchlist');
      localStorage.setItem(key, JSON.stringify(watchlist));

      // Sync watchlist to backend
      if (isAuthenticated && user) {
        const simpleWatchlist = watchlist.map(item => ({
          movie_id: item.movie.movie_id,
          status: item.status,
        }));
        authApi.syncUserData({ watchlist: simpleWatchlist }).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to save watchlist', e);
    }
  }, [watchlist, isAuthenticated, user, userStorageKey]);

  // Metadata Hydration: Automatically fetch full V6 movie details for rated movies missing metadata
  useEffect(() => {
    const ratedIds = Object.keys(ratings).map(Number);
    if (ratedIds.length === 0) return;

    const missingIds = ratedIds.filter(
      id => !ratedMoviesDetails[id] || !ratedMoviesDetails[id].cast || !ratedMoviesDetails[id].crew
    );

    if (missingIds.length === 0) return;

    let isMounted = true;
    setIsHydratingDetails(true);

    const hydrateMetadata = async () => {
      try {
        const promises = missingIds.map(id =>
          movieApi.getMovie(id).catch(err => {
            console.warn(`Failed to hydrate metadata for movie #${id}:`, err);
            return null;
          })
        );

        const results = await Promise.all(promises);

        if (!isMounted) return;

        setRatedMoviesDetails(prev => {
          const updated = { ...prev };
          results.forEach(res => {
            if (res && res.success && res.movie) {
              updated[res.movie.movie_id] = res.movie;
            }
          });
          return updated;
        });
      } catch (err) {
        console.error('Error hydrating rated movie details:', err);
      } finally {
        if (isMounted) {
          setIsHydratingDetails(false);
        }
      }
    };

    hydrateMetadata();

    return () => {
      isMounted = false;
    };
  }, [ratings]);

  // Initial load of recommendations
  useEffect(() => {
    if (Object.keys(ratings).length > 0 && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, []);

  // Rate Movie
  const rateMovie = useCallback((movie: Movie, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [movie.movie_id]: rating,
    }));

    // If movie doesn't have full V6 cast/crew, fetch it in the background
    if (!movie.cast || !movie.crew) {
      movieApi.getMovie(movie.movie_id).then(res => {
        if (res.success && res.movie) {
          setRatedMoviesDetails(prev => ({
            ...prev,
            [movie.movie_id]: res.movie,
          }));
        }
      }).catch(() => {
        setRatedMoviesDetails(prev => ({
          ...prev,
          [movie.movie_id]: movie,
        }));
      });
    } else {
      setRatedMoviesDetails(prev => ({
        ...prev,
        [movie.movie_id]: movie,
      }));
    }

    // If movie was in watchlist as 'want_to_watch', mark as 'watched' with this rating
    setWatchlist(prev => {
      const exists = prev.find(item => item.movie.movie_id === movie.movie_id);
      if (exists) {
        return prev.map(item =>
          item.movie.movie_id === movie.movie_id
            ? { ...item, status: 'watched', user_rating: rating }
            : item
        );
      }
      return [
        {
          movie,
          added_at: Date.now(),
          status: 'watched',
          user_rating: rating,
        },
        ...prev,
      ];
    });

    setHasPendingTasteUpdate(true);
  }, []);

  // Remove rating
  const removeRating = useCallback((movieId: number) => {
    setRatings(prev => {
      const updated = { ...prev };
      delete updated[movieId];
      return updated;
    });
    setHasPendingTasteUpdate(true);
  }, []);

  // Watchlist helpers
  const addToWatchlist = useCallback((movie: Movie) => {
    setWatchlist(prev => {
      if (prev.some(item => item.movie.movie_id === movie.movie_id)) {
        return prev;
      }
      return [
        {
          movie,
          added_at: Date.now(),
          status: 'want_to_watch',
        },
        ...prev,
      ];
    });
  }, []);

  const removeFromWatchlist = useCallback((movieId: number) => {
    setWatchlist(prev => prev.filter(item => item.movie.movie_id !== movieId));
  }, []);

  const toggleWatched = useCallback((movie: Movie) => {
    setWatchlist(prev => {
      const existing = prev.find(item => item.movie.movie_id === movie.movie_id);
      if (existing) {
        return prev.map(item =>
          item.movie.movie_id === movie.movie_id
            ? { ...item, status: item.status === 'watched' ? 'want_to_watch' : 'watched' }
            : item
        );
      } else {
        return [
          {
            movie,
            added_at: Date.now(),
            status: 'watched',
          },
          ...prev,
        ];
      }
    });
  }, []);

  // Complete Onboarding
  const completeOnboarding = useCallback(async (starterRatings: { movie: Movie; rating: number }[]) => {
    const newRatings: Record<number, number> = {};
    const newDetails: Record<number, Movie> = {};

    starterRatings.forEach(item => {
      newRatings[item.movie.movie_id] = item.rating;
      newDetails[item.movie.movie_id] = item.movie;
    });

    setRatings(newRatings);
    setRatedMoviesDetails(newDetails);
    setHasCompletedOnboarding(true);

    await fetchRecommendations(newRatings);
  }, [fetchRecommendations]);

  const resetTasteProfile = useCallback(() => {
    setRatings(DEFAULT_SEED_RATINGS);
    setRatedMoviesDetails({});
    setWatchlist([]);
    setHasCompletedOnboarding(false);
    fetchRecommendations(DEFAULT_SEED_RATINGS);
  }, [fetchRecommendations]);

  const clearPendingTasteUpdate = useCallback(() => {
    setHasPendingTasteUpdate(false);
  }, []);

  // Compute Taste Profile & DNA Metrics with Rating-Weighted Personalization Engine
  const tasteProfile = useMemo<TasteProfile>(() => {
    const ratingEntries = Object.entries(ratings);
    const total_rated = ratingEntries.length;

    if (total_rated === 0) {
      return {
        total_rated: 0,
        average_rating: 0,
        genre_distribution: {},
        top_genres: [],
        top_actors: [],
        top_directors: [],
        taste_archetype: 'Cinema Explorer',
        taste_description: 'Rate movies to unlock your personalized CineMind Taste DNA profile.',
        dynamic_summary: 'Your taste profile is waiting to be calibrated. Rate movies in Onboarding or Discover to reveal your favorite actors, directors, and cinematic archetypes.',
        rated_movies: {},
        is_hydrating: isHydratingDetails,
      };
    }

    const sumRating = ratingEntries.reduce((acc, [, val]) => acc + val, 0);
    const average_rating = Math.round((sumRating / total_rated) * 10) / 10;

    // 1. Genre distribution weighted by user ratings
    const genreScores: Record<string, number> = {};
    let totalGenreWeight = 0;

    ratingEntries.forEach(([mIdStr, score]) => {
      const mId = Number(mIdStr);
      const detail = ratedMoviesDetails[mId];
      if (detail && detail.genres) {
        const glist = detail.genres.split('|');
        glist.forEach(g => {
          const trimmed = g.trim();
          if (trimmed) {
            genreScores[trimmed] = (genreScores[trimmed] || 0) + score;
            totalGenreWeight += score;
          }
        });
      }
    });

    const top_genres = Object.entries(genreScores)
      .map(([genre, count]) => ({
        genre,
        count: Math.round(count * 10) / 10,
        percentage: totalGenreWeight > 0 ? Math.round((count / totalGenreWeight) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // 2. Favorite Actors Aggregation (Weighted by rating and billing order)
    const actorMap: Record<string, {
      name: string;
      score: number;
      count: number;
      totalRating: number;
      movies: Set<string>;
      character?: string;
      profile_path?: string | null;
    }> = {};

    // 3. Favorite Directors Aggregation (Weighted by user rating)
    const directorMap: Record<string, {
      name: string;
      score: number;
      count: number;
      totalRating: number;
      movies: Set<string>;
    }> = {};

    ratingEntries.forEach(([mIdStr, userRating]) => {
      const mId = Number(mIdStr);
      const detail = ratedMoviesDetails[mId];
      if (!detail) return;

      const movieTitle = cleanMovieTitle(detail.title).title;

      // Extract & Aggregate Cast
      const castList = getCastMembers(detail.cast);
      if (castList.length > 0) {
        // Consider top 6 billed actors for each rated movie
        castList.slice(0, 6).forEach((actor, index) => {
          if (!actor.name || actor.name === 'Cast') return;

          // Position weight: higher billed actors receive higher signal weight
          const positionWeight = Math.max(0.5, 1.0 - index * 0.1);
          const weightedScore = userRating * positionWeight;

          if (!actorMap[actor.name]) {
            actorMap[actor.name] = {
              name: actor.name,
              score: 0,
              count: 0,
              totalRating: 0,
              movies: new Set<string>(),
              character: actor.character !== 'Cast' ? actor.character : undefined,
              profile_path: actor.profile_path,
            };
          }

          actorMap[actor.name].score += weightedScore;
          actorMap[actor.name].count += 1;
          actorMap[actor.name].totalRating += userRating;
          actorMap[actor.name].movies.add(movieTitle);
          if (actor.profile_path && !actorMap[actor.name].profile_path) {
            actorMap[actor.name].profile_path = actor.profile_path;
          }
        });
      }

      // Extract & Aggregate Directors
      if (detail.crew && Array.isArray(detail.crew)) {
        detail.crew.forEach((member: any) => {
          if (typeof member === 'object' && member !== null && member.job === 'Director' && member.name) {
            const dirName = member.name.trim();
            if (!dirName) return;

            if (!directorMap[dirName]) {
              directorMap[dirName] = {
                name: dirName,
                score: 0,
                count: 0,
                totalRating: 0,
                movies: new Set<string>(),
              };
            }

            directorMap[dirName].score += userRating;
            directorMap[dirName].count += 1;
            directorMap[dirName].totalRating += userRating;
            directorMap[dirName].movies.add(movieTitle);
          }
        });
      }
    });

    const top_actors: TasteActor[] = Object.values(actorMap)
      .map(item => ({
        name: item.name,
        score: Math.round(item.score * 10) / 10,
        count: item.count,
        avg_rating: Math.round((item.totalRating / item.count) * 10) / 10,
        movies: Array.from(item.movies),
        character: item.character,
        profile_path: item.profile_path,
      }))
      .sort((a, b) => b.score - a.score || b.count - a.count)
      .slice(0, 8);

    const top_directors: TasteDirector[] = Object.values(directorMap)
      .map(item => ({
        name: item.name,
        score: Math.round(item.score * 10) / 10,
        count: item.count,
        avg_rating: Math.round((item.totalRating / item.count) * 10) / 10,
        movies: Array.from(item.movies),
      }))
      .sort((a, b) => b.score - a.score || b.count - a.count)
      .slice(0, 6);

    // Dynamic Taste Archetypes
    let taste_archetype = 'Eclectic Connoisseur';
    let taste_description = 'You appreciate deep storytelling, bold cinematic craft, and rich narrative depth across diverse genres.';

    if (top_genres.length > 0) {
      const lead = top_genres[0].genre;
      if (lead === 'Sci-Fi') {
        taste_archetype = 'Sci-Fi Visionary';
        taste_description = 'You are fascinated by reality-bending concepts, futuristic tech, and philosophical questions of human existence.';
      } else if (lead === 'Drama' || lead === 'Crime') {
        taste_archetype = 'Narrative Purist';
        taste_description = 'You prioritize nuanced character studies, high stakes, and masterclass performances that resonate long after credits roll.';
      } else if (lead === 'Comedy' || lead === 'Animation') {
        taste_archetype = 'Heartfelt Optimist';
        taste_description = 'You love vibrant energy, sharp wit, imaginative aesthetics, and emotionally uplifting adventures.';
      } else if (lead === 'Action' || lead === 'Thriller' || lead === 'Adventure') {
        taste_archetype = 'Adrenaline Enthusiast';
        taste_description = 'You gravitate toward high-octane pacing, breathtaking spectacle, tension, and razor-sharp thrillers.';
      } else if (lead === 'Horror' || lead === 'Mystery') {
        taste_archetype = 'Shadow Seeker';
        taste_description = 'You relish suspense, unsettling atmospheric dread, and labyrinthine plot twists.';
      }
    }

    // Dynamic Natural Language Summary derived strictly from user's actual rating signals
    let dynamic_summary = '';
    const leadGenreNames = top_genres.slice(0, 2).map(g => g.genre).join(' and ');
    const topActor = top_actors.length > 0 ? top_actors[0] : null;
    const topDirector = top_directors.length > 0 ? top_directors[0] : null;

    if (leadGenreNames && topDirector && topActor) {
      dynamic_summary = `Your taste leans heavily toward ${leadGenreNames}. You demonstrate a distinct affinity for films directed by ${topDirector.name} and standout performances by ${topActor.name}.`;
    } else if (leadGenreNames && topDirector) {
      dynamic_summary = `Your taste is strongly anchored in ${leadGenreNames}, with a clear preference for the directorial storytelling of ${topDirector.name}.`;
    } else if (leadGenreNames && topActor) {
      dynamic_summary = `Your taste highlights an appreciation for ${leadGenreNames}, anchored by compelling roles from ${topActor.name}.`;
    } else if (leadGenreNames) {
      dynamic_summary = `Your taste leans predominantly toward ${leadGenreNames}, driven by high-quality productions and immersive storytelling.`;
    } else {
      dynamic_summary = 'Rate a few more movies to unlock your complete personalized Taste DNA summary.';
    }

    return {
      total_rated,
      average_rating,
      genre_distribution: genreScores,
      top_genres,
      top_actors,
      top_directors,
      taste_archetype,
      taste_description,
      dynamic_summary,
      rated_movies: ratings,
      is_hydrating: isHydratingDetails,
    };
  }, [ratings, ratedMoviesDetails, isHydratingDetails]);

  const value = {
    ratings,
    ratedMoviesDetails,
    watchlist,
    recommendations,
    isLoadingRecommendations,
    isHydratingDetails,
    recommendationError,
    hasCompletedOnboarding,
    hasPendingTasteUpdate,
    tasteProfile,
    rateMovie,
    removeRating,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
    fetchRecommendations,
    completeOnboarding,
    resetTasteProfile,
    clearPendingTasteUpdate,
    selectedMovieForModal,
    setSelectedMovieForModal,
    selectedRecForWhyModal,
    setSelectedRecForWhyModal,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isAuthOpen,
    setIsAuthOpen,
  };

  return <TasteContext.Provider value={value}>{children}</TasteContext.Provider>;
};

export const useTaste = () => {
  const context = useContext(TasteContext);
  if (!context) {
    throw new Error('useTaste must be used within a TasteProvider');
  }
  return context;
};

