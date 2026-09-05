import React, { useState } from 'react';
import { useTaste } from '../context/TasteContext';
import { RecommendationCard } from '../components/recommendations/RecommendationCard';
import { Button } from '../components/ui/Button';
import { Sparkles, RefreshCw, Brain, Sliders, Info, PlusCircle, Star, AlertCircle } from 'lucide-react';
import { cleanMovieTitle } from '../utils/movieUtils';

export const ForYouPage: React.FC = () => {
  const {
    recommendations,
    isLoadingRecommendations,
    recommendationError,
    fetchRecommendations,
    ratings,
    ratedMoviesDetails,
    setIsOnboardingOpen,
    removeRating,
  } = useTaste();

  const [showSeedDrawer, setShowSeedDrawer] = useState<boolean>(false);
  const ratedEntries = Object.entries(ratings);
  const ratedCount = ratedEntries.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 text-brand-400" />
            <span>Hybrid ML Showcase (TF-IDF + Bayesian SVD)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Personalized For You
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Ranked using 5,000-dim content similarity cosine vectors combined with quality scores from your {ratedCount} rated films.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowSeedDrawer(!showSeedDrawer)}
            leftIcon={<Sliders className="w-3.5 h-3.5 text-slate-400" />}
          >
            Seed Movies ({ratedCount})
          </Button>

          <Button
            size="sm"
            variant="glow"
            isLoading={isLoadingRecommendations}
            onClick={() => fetchRecommendations()}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecommendations ? 'animate-spin' : ''}`} />}
          >
            Refresh Recommendations
          </Button>
        </div>
      </div>

      {/* Collapsible Seed Ratings Drawer */}
      {showSeedDrawer && (
        <div className="p-5 rounded-2xl bg-surface-100 border border-brand-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold text-white">Active Seeds Feeding The ML Model</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOnboardingOpen(true)}
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              Rate More
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {ratedEntries.map(([mIdStr, score]) => {
              const mId = Number(mIdStr);
              const detail = ratedMoviesDetails[mId];
              const title = detail ? cleanMovieTitle(detail.title).title : `Movie #${mId}`;
              return (
                <div
                  key={mId}
                  className="p-3 rounded-xl bg-surface-200 border border-white/5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{title}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-300 font-mono">
                      <span>{score}</span>
                      <Star className="w-2.5 h-2.5 fill-amber-300" />
                    </div>
                  </div>

                  <button
                    onClick={() => removeRating(mId)}
                    className="text-slate-500 hover:text-rose-400 text-xs p-1"
                    title="Remove from seed list"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error state */}
      {recommendationError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold">Could not refresh recommendations</p>
            <p className="text-[11px] text-rose-300/80">{recommendationError}</p>
            <Button
              size="sm"
              variant="danger"
              onClick={() => fetchRecommendations()}
              className="mt-2 text-xs"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      {isLoadingRecommendations ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-slate-800/40 skeleton-shimmer" />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl border border-dashed border-white/10 bg-surface-100/40 p-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Recommendations Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Rate a few starter movies to kickstart the ML vector calculation.
            </p>
          </div>
          <Button variant="glow" onClick={() => setIsOnboardingOpen(true)}>
            Start 60-Second Onboarding
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {recommendations.map((rec, index) => (
            <RecommendationCard key={rec.movie_id} movie={rec} rank={index + 1} />
          ))}
        </div>
      )}

    </div>
  );
};
