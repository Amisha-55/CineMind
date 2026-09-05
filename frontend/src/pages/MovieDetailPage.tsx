import React, { useState, useEffect } from 'react';
import { Star, Plus, Check, Eye, Sparkles, Film, Clock, Flame, Award, Clapperboard, Users, User as UserIcon } from 'lucide-react';
import { useTaste } from '../context/TasteContext';
import { movieApi } from '../api/movies';
import { Movie, RecommendationMovie } from '../types';
import {
  cleanMovieTitle,
  getMoviePosterUrl,
  getStarRating,
  formatRuntime,
  getDirector,
  getKeyCrewMembers,
  getCastMembers,
  getInitials,
} from '../utils/movieUtils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StarRating } from '../components/ui/StarRating';
import { Modal } from '../components/ui/Modal';

export const MovieDetailModal: React.FC = () => {
  const {
    selectedMovieForModal,
    setSelectedMovieForModal,
    ratings,
    rateMovie,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
  } = useTaste();

  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [similarMovies, setSimilarMovies] = useState<RecommendationMovie[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState<boolean>(false);

  const baseMovie = selectedMovieForModal;

  // Load enriched V6 metadata and similar movies when modal opens
  useEffect(() => {
    if (!baseMovie) {
      setMovieDetails(null);
      setSimilarMovies([]);
      return;
    }

    setMovieDetails(baseMovie);
    loadFullDetails(baseMovie.movie_id);
    loadSimilar(baseMovie.movie_id);
  }, [baseMovie?.movie_id]);

  const loadFullDetails = async (mId: number) => {
    setIsLoadingDetails(true);
    try {
      const res = await movieApi.getMovie(mId);
      if (res.success && res.movie) {
        setMovieDetails(res.movie);
      }
    } catch (err) {
      console.warn('Failed to load full movie details', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const loadSimilar = async (mId: number) => {
    setIsLoadingSimilar(true);
    try {
      const res = await movieApi.getSimilarMovies(mId, 6);
      if (res.success && res.similar) {
        setSimilarMovies(res.similar);
      }
    } catch (err) {
      console.warn('Failed to load similar movies', err);
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  if (!baseMovie) return null;

  const movie = movieDetails || baseMovie;
  const { title, year } = cleanMovieTitle(movie.title);
  const posterUrl = getMoviePosterUrl(movie);
  const userRating = ratings[movie.movie_id];
  const inWatchlist = watchlist.some(item => item.movie.movie_id === movie.movie_id);
  const isWatched = watchlist.some(
    item => item.movie.movie_id === movie.movie_id && item.status === 'watched'
  );

  const genres = movie.genres ? movie.genres.split('|') : [];
  const runtimeFormatted = formatRuntime(movie.runtime);
  const director = getDirector(movie.crew);
  const keyCrew = getKeyCrewMembers(movie.crew);
  const castList = getCastMembers(movie.cast);

  return (
    <Modal
      isOpen={!!selectedMovieForModal}
      onClose={() => setSelectedMovieForModal(null)}
      maxWidth="4xl"
    >
      <div className="space-y-8 max-h-[85vh] overflow-y-auto pr-1">
        
        {/* Top Hero Backdrop & Meta */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 p-6 sm:p-8">
          {/* Subtle Ambient Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/60 via-surface-200/95 to-surface-200 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Poster Card */}
            <div className="w-36 sm:w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 flex-shrink-0 bg-slate-950">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-4">
              
              <div className="space-y-1.5">
                {/* Score & Meta Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="quality" size="sm" className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{getStarRating(movie.quality_score)} Quality</span>
                  </Badge>

                  {movie.vote_average !== null && movie.vote_average !== undefined && (
                    <Badge variant="outline" size="sm" className="flex items-center gap-1 border-amber-500/30 text-amber-300 bg-amber-500/10">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>★ {movie.vote_average.toFixed(1)} TMDB</span>
                      {movie.vote_count ? (
                        <span className="text-[10px] text-slate-400">({movie.vote_count.toLocaleString()})</span>
                      ) : null}
                    </Badge>
                  )}

                  {runtimeFormatted && (
                    <Badge variant="outline" size="sm" className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{runtimeFormatted}</span>
                    </Badge>
                  )}

                  {movie.popularity !== null && movie.popularity !== undefined && (
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      Pop {Math.round(movie.popularity)}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  {title}
                </h2>

                {/* Tagline */}
                {movie.tagline && (
                  <p className="text-xs sm:text-sm italic text-brand-300 font-medium">
                    "{movie.tagline}"
                  </p>
                )}

                {/* Release & Director Subtitle */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-0.5">
                  <span>Released {movie.release_date || (year ? `${year}` : 'N/A')}</span>
                  {director && (
                    <>
                      <span>•</span>
                      <span className="text-indigo-300 font-medium flex items-center gap-1">
                        <Clapperboard className="w-3.5 h-3.5 text-brand-400" />
                        Directed by {director}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>ID #{movie.movie_id}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {genres.map((g) => (
                  <Badge key={g} variant="genre" genreName={g} size="md">
                    {g}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <Button
                  variant={inWatchlist ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => (inWatchlist ? removeFromWatchlist(movie.movie_id) : addToWatchlist(movie))}
                  leftIcon={inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                >
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>

                <Button
                  variant={isWatched ? 'glow' : 'ghost'}
                  size="sm"
                  onClick={() => toggleWatched(movie)}
                  leftIcon={<Eye className="w-4 h-4" />}
                  className={isWatched ? '' : 'border border-white/10'}
                >
                  {isWatched ? 'Watched' : 'Mark as Watched'}
                </Button>
              </div>

              {/* Rating Widget */}
              <div className="p-4 rounded-2xl bg-surface-100/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                <div>
                  <span className="text-xs font-semibold text-white">Your Rating:</span>
                  <p className="text-[11px] text-slate-400">
                    {userRating ? `You gave this movie ${userRating} Stars` : 'Rate to refine your Taste DNA profile'}
                  </p>
                </div>
                <StarRating
                  rating={userRating || 0}
                  onRatingChange={(r) => rateMovie(movie, r)}
                  size="md"
                  showLabel
                />
              </div>

            </div>

          </div>
        </div>

        {/* Story / Overview Section */}
        {movie.overview && (
          <div className="p-6 rounded-3xl bg-surface-100/80 border border-white/5 space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-brand-400" />
              Storyline & Synopsis
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {movie.overview}
            </p>
          </div>
        )}

        {/* Top Billed Cast Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              Top Billed Cast
            </h3>
            <span className="text-xs text-slate-400">
              {castList.length > 0 ? `${castList.length} Actors` : ''}
            </span>
          </div>

          {castList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {castList.slice(0, 10).map((actor, idx) => (
                <div
                  key={`${actor.name}_${idx}`}
                  className="p-3 rounded-2xl bg-surface-100 border border-white/5 flex items-center gap-3 hover:border-brand-500/30 transition-colors"
                >
                  {/* Actor Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-tr from-brand-700 to-indigo-600 border border-brand-500/40 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{getInitials(actor.name)}</span>
                    )}
                  </div>

                  {/* Actor & Character Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate" title={actor.name}>
                      {actor.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate" title={actor.character}>
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-surface-100/50 border border-white/5 text-center text-xs text-slate-400">
              {isLoadingDetails ? 'Loading cast metadata...' : 'Cast details not available for this catalog entry.'}
            </div>
          )}
        </div>

        {/* Key Crew Section */}
        {keyCrew.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-accent-cyan" />
              Key Crew & Production
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {keyCrew.map((member, idx) => (
                <div
                  key={`${member.name}_${member.job}_${idx}`}
                  className="px-3.5 py-2 rounded-xl bg-surface-100 border border-white/5 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-400" />
                  <div>
                    <span className="text-xs font-semibold text-white mr-1.5">{member.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      ({member.job})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More Like This (Similar Movies from Recommender Engine) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              More Like This
            </h3>
            <span className="text-[11px] text-slate-400">
              (Content-aligned via TF-IDF cosine similarity)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {isLoadingSimilar ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-slate-800/40 animate-pulse" />
              ))
            ) : (
              similarMovies.map((sim) => {
                const sClean = cleanMovieTitle(sim.title);
                const sPoster = getMoviePosterUrl(sim);
                return (
                  <div
                    key={sim.movie_id}
                    onClick={() => setSelectedMovieForModal(sim)}
                    className="p-2 rounded-xl bg-surface-100 border border-white/5 hover:border-brand-500/40 transition-all cursor-pointer group"
                  >
                    <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-slate-950 mb-2">
                      <img
                        src={sPoster}
                        alt={sClean.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-[11px] font-semibold text-white truncate group-hover:text-brand-300">
                      {sClean.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{sClean.year}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};

