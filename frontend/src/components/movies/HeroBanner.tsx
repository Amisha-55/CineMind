import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Star, Play, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTaste } from '../../context/TasteContext';
import { Movie } from '../../types';
import { cleanMovieTitle, getMoviePosterUrl } from '../../utils/movieUtils';

interface HeroBannerProps {
  featuredMovie?: Movie;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredMovie }) => {
  const navigate = useNavigate();
  const { setIsOnboardingOpen, setSelectedMovieForModal, ratings } = useTaste();

  const fallbackFeatured: Movie = {
    movie_id: 318,
    title: 'Shawshank Redemption, The (1994)',
    genres: 'Drama',
    tmdb_id: 278,
    quality_score: 4.38,
    year: 1994,
  };

  const movie = featuredMovie || fallbackFeatured;
  const { title, year } = cleanMovieTitle(movie.title);
  const posterUrl = getMoviePosterUrl(movie);
  const ratedCount = Object.keys(ratings).length;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-surface-100/80 to-[#080B10] shadow-2xl p-6 sm:p-10 lg:p-14 mb-10">
      {/* Ambient background lighting */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-brand-600/15 via-indigo-900/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Left Column: Hero Copy & Actions */}
        <div className="lg:col-span-7 space-y-6">

          {/* Tag / Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI Hybrid Recommendation Engine V5</span>
          </div>

          {/* Main Headline & Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
              Movies you'll love.{' '}
              <span className="text-gradient-brand">
                Recommendations that learn you.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Discover movies tailored to your taste — from your first ratings to every recommendation that follows.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              variant="glow"
              onClick={() => setIsOnboardingOpen(true)}
              leftIcon={<Sparkles className="w-5 h-5 text-indigo-200" />}
            >
              {ratedCount > 0 ? 'Refine Taste DNA' : 'Start Personalizing'}
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/discover')}
              leftIcon={<Compass className="w-5 h-5 text-slate-300" />}
            >
              Explore Movies
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => navigate('/for-you')}
              className="text-indigo-300 hover:text-indigo-200 border border-brand-500/20"
            >
              View For You →
            </Button>
          </div>

          {/* Micro stats banner */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div>
              <strong className="text-white font-mono">3,880+</strong> Movies
            </div>
            <span className="text-slate-600">•</span>
            <div>
              <strong className="text-white font-mono">18</strong> Genres
            </div>
            <span className="text-slate-600">•</span>
            <div>
              <strong className="text-white font-mono">Real-Time</strong> Re-Ranking
            </div>
          </div>
        </div>

        {/* Right Column: Featured Spotlight Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div
            onClick={() => setSelectedMovieForModal(movie)}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden glass-card p-4 border border-white/15 shadow-2xl cursor-pointer group hover:border-brand-500/40 transition-all"
          >
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 bg-slate-900">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-2.5 right-2.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-black flex items-center gap-1 shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                  {movie.quality_score.toFixed(1)}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                <span className="text-xs font-medium text-slate-300">Featured Spotlight</span>
                <span className="text-xs font-mono text-brand-300 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Details
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-slate-400">
                  {year} • {movie.genres}
                </p>
              </div>

              <button
                className="p-2.5 rounded-xl bg-brand-600/80 hover:bg-brand-500 text-white shadow-glow-brand transition-colors"
                aria-label="View spotlight movie"
              >
                <Play className="w-4 h-4 fill-white" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
