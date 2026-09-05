import React from 'react';
import { useTaste } from '../context/TasteContext';
import { useAuth } from '../context/AuthContext';
import { cleanMovieTitle, getMoviePosterUrl, getInitials } from '../utils/movieUtils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  Brain,
  Star,
  Film,
  Eye,
  RotateCcw,
  Award,
  BarChart3,
  User as UserIcon,
  LogOut,
  LogIn,
  Users,
  Clapperboard,
  Compass,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    tasteProfile,
    watchlist,
    ratings,
    ratedMoviesDetails,
    setIsOnboardingOpen,
    setIsAuthOpen,
    setSelectedMovieForModal,
  } = useTaste();

  const watchedCount = watchlist.filter((item) => item.status === 'watched').length;
  const wantToWatchCount = watchlist.filter((item) => item.status === 'want_to_watch').length;

  const topRatedEntries = Object.entries(ratings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([mIdStr, score]) => {
      const mId = Number(mIdStr);
      const detail = ratedMoviesDetails[mId] || {
        movie_id: mId,
        title: `Movie #${mId}`,
        genres: 'Drama',
        tmdb_id: 0,
        quality_score: score,
      };
      return { detail, rating: score };
    });

  const hasRatings = tasteProfile.total_rated > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Profile Header Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-surface-100 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-brand-600/20 border-2 border-brand-500/40 p-1 flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {isAuthenticated && user ? user.name : 'Guest Cinephile'}
                </h1>
                <Badge variant={isAuthenticated ? 'hybrid' : 'outline'} size="sm">
                  {isAuthenticated ? 'Authenticated Account' : 'Guest Mode'}
                </Badge>
                {tasteProfile.is_hydrating && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 animate-pulse">
                    Enriching V6 Signals...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAuthenticated && user
                  ? `${user.email}`
                  : 'Sign in to sync your ratings and taste profile across devices permanently.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!isAuthenticated ? (
              <Button
                size="sm"
                variant="glow"
                onClick={() => setIsAuthOpen(true)}
                leftIcon={<LogIn className="w-3.5 h-3.5" />}
              >
                Sign In / Register
              </Button>
            ) : (
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
              >
                Log Out
              </Button>
            )}

            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsOnboardingOpen(true)}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Re-Calibrate Taste
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-100 border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Movies Rated</span>
          </div>
          <p className="text-2xl font-mono font-bold text-white">
            {tasteProfile.total_rated}
          </p>
          <p className="text-[10px] text-slate-500">Inputs to ML vector</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Watched Log</span>
          </div>
          <p className="text-2xl font-mono font-bold text-white">
            {watchedCount}
          </p>
          <p className="text-[10px] text-slate-500">Completed films</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Film className="w-4 h-4 text-brand-400" />
            <span>Want to Watch</span>
          </div>
          <p className="text-2xl font-mono font-bold text-white">
            {wantToWatchCount}
          </p>
          <p className="text-[10px] text-slate-500">Backlog queue</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-100 border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <BarChart3 className="w-4 h-4 text-accent-purple" />
            <span>Average Rating</span>
          </div>
          <p className="text-2xl font-mono font-bold text-white">
            {tasteProfile.average_rating ? `${tasteProfile.average_rating} ★` : '—'}
          </p>
          <p className="text-[10px] text-slate-500">Taste generosity</p>
        </div>
      </div>

      {/* If No Ratings: Render Engaging Empty State */}
      {!hasRatings ? (
        <div className="p-8 sm:p-14 rounded-3xl bg-surface-100/80 border border-white/10 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative w-20 h-20 mx-auto rounded-3xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-glow-brand">
            <Brain className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Unlock Your Taste DNA
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your personalized Taste DNA profile is waiting to be synthesized. Rate movies you have watched or complete our 60-second onboarding calibration to discover your cinematic archetype, favorite actors, and director affinities.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              variant="glow"
              onClick={() => setIsOnboardingOpen(true)}
              leftIcon={<Sparkles className="w-5 h-5 text-indigo-200" />}
            >
              Launch 60-Sec Onboarding
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/discover')}
              leftIcon={<Compass className="w-5 h-5 text-slate-300" />}
            >
              Explore & Rate Movies
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* 3. Taste Archetype & Personalized Dynamic Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Archetype & Narrative Card */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-brand-950/50 via-surface-100 to-surface-100 border border-brand-500/30 space-y-5 shadow-xl">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-white">Taste DNA Archetype</h3>
              </div>

              <div className="space-y-2.5">
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-indigo-200 to-accent-purple">
                  {tasteProfile.taste_archetype}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {tasteProfile.taste_description}
                </p>
              </div>

              {/* Dynamic Personalized Narrative generated from actual ratings */}
              <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalized Taste Synthesis</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{tasteProfile.dynamic_summary}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Recommender Vector Telemetry
                </span>
                <div className="p-3.5 rounded-xl bg-surface-200 border border-white/5 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>TF-IDF Vector Dimension:</span>
                    <span className="font-mono text-white">5,000 Dimensions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Multiplier:</span>
                    <span className="font-mono text-amber-300">Enriched V6 Bayesian</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Persistence:</span>
                    <span className="font-mono text-emerald-400">
                      {isAuthenticated ? 'Active (SQLite Account)' : 'Local Session Storage'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Genre Distribution Breakdown */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-surface-100 border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Favorite Genres Distribution
                </h3>
                <span className="text-xs text-slate-400">Weighted by Ratings</span>
              </div>

              <div className="space-y-3.5 pt-1">
                {tasteProfile.top_genres.length > 0 ? (
                  tasteProfile.top_genres.slice(0, 6).map((g) => (
                    <div key={g.genre} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-200">{g.genre}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">{g.count} pts</span>
                          <span className="font-mono text-brand-300 font-bold">{g.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-surface-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-accent-purple rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(8, g.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Rate more movies to build your genre distribution chart.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* 4. Favorite Actors Section (Derived from V6 Cast & User Ratings) */}
          {tasteProfile.top_actors.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-400" />
                    Favorite Actors
                  </h3>
                  <p className="text-xs text-slate-400">
                    Aggregated from high-scoring performances across your rated films
                  </p>
                </div>
                <span className="text-xs font-mono text-brand-300">
                  {tasteProfile.top_actors.length} Highlighted
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tasteProfile.top_actors.map((actor) => (
                  <div
                    key={actor.name}
                    className="p-4 rounded-2xl bg-surface-100 border border-white/5 hover:border-brand-500/30 transition-all space-y-3 group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Actor Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-tr from-brand-700 to-indigo-600 border border-brand-500/40 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span>{getInitials(actor.name)}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-brand-300 transition-colors">
                          {actor.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{actor.avg_rating} Avg Rating</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 border-t border-white/5">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Appeared in:</span>
                        <span className="text-slate-300 font-medium">{actor.count} rated {actor.count === 1 ? 'film' : 'films'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {actor.movies.slice(0, 2).map((mTitle) => (
                          <span
                            key={mTitle}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5 truncate max-w-full"
                            title={mTitle}
                          >
                            {mTitle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Favorite Directors Section (Derived from V6 Key Crew & User Ratings) */}
          {tasteProfile.top_directors.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clapperboard className="w-5 h-5 text-accent-cyan" />
                    Favorite Directors
                  </h3>
                  <p className="text-xs text-slate-400">
                    Filmmakers whose vision most closely aligns with your rating history
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-300">
                  {tasteProfile.top_directors.length} Directors
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasteProfile.top_directors.map((director) => (
                  <div
                    key={director.name}
                    className="p-4 rounded-2xl bg-surface-100 border border-white/5 hover:border-cyan-500/30 transition-all space-y-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
                        <Clapperboard className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {director.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{director.avg_rating} Avg Rating</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 border-t border-white/5">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Directed:</span>
                        <span className="text-slate-300 font-medium">{director.count} rated {director.count === 1 ? 'film' : 'films'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {director.movies.slice(0, 3).map((mTitle) => (
                          <span
                            key={mTitle}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5 truncate max-w-full"
                            title={mTitle}
                          >
                            {mTitle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Top Rated Movies Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Your Highest-Rated Seed Movies
                </h3>
                <p className="text-xs text-slate-400">
                  The primary anchors for your TF-IDF user preference profile
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate('/my-list')}
              >
                View All Rated ({tasteProfile.total_rated})
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {topRatedEntries.map((item) => {
                const { title, year } = cleanMovieTitle(item.detail.title);
                const poster = getMoviePosterUrl(item.detail);
                return (
                  <div
                    key={item.detail.movie_id}
                    onClick={() => setSelectedMovieForModal(item.detail)}
                    className="p-2.5 rounded-2xl bg-surface-100 border border-white/5 hover:border-brand-500/40 transition-all space-y-2 group cursor-pointer"
                  >
                    <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-900 relative">
                      <img src={poster} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-500 text-white font-bold text-[10px] shadow-md flex items-center gap-0.5">
                        <span>{item.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-brand-300 transition-colors">{title}</h4>
                      <p className="text-[10px] text-slate-400">{year}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

