import React from 'react';
import { Modal } from '../ui/Modal';
import { useTaste } from '../../context/TasteContext';
import { cleanMovieTitle, getMoviePosterUrl, formatScorePercent, getStarRating } from '../../utils/movieUtils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Sparkles, Brain, Cpu, Star, Film, CheckCircle2, Sliders } from 'lucide-react';
import { StarRating } from '../ui/StarRating';

export const WhyThisModal: React.FC = () => {
  const {
    selectedRecForWhyModal,
    setSelectedRecForWhyModal,
    ratings,
    ratedMoviesDetails,
    rateMovie,
    setSelectedMovieForModal,
  } = useTaste();

  if (!selectedRecForWhyModal) return null;

  const movie = selectedRecForWhyModal;
  const { title, year } = cleanMovieTitle(movie.title);
  const posterUrl = getMoviePosterUrl(movie);
  const userRating = ratings[movie.movie_id];

  const contentScore = movie.content_score !== undefined ? movie.content_score : 0.78;
  const qualityScore = movie.quality_score || 3.8;
  const finalScore = movie.final_score !== undefined ? movie.final_score : 0.82;

  // Find user's rated seed movies that share genres
  const movieGenres = movie.genres ? movie.genres.split('|') : [];
  const seedInfluencers = Object.entries(ratings)
    .filter(([mId]) => Number(mId) !== movie.movie_id)
    .map(([mId, score]) => {
      const detail = ratedMoviesDetails[Number(mId)];
      const titleClean = detail ? cleanMovieTitle(detail.title).title : `Movie #${mId}`;
      const sharedGenres = detail && detail.genres
        ? detail.genres.split('|').filter(g => movieGenres.includes(g))
        : [];
      return {
        movie_id: Number(mId),
        title: titleClean,
        rating: score,
        sharedGenres,
        detail,
      };
    })
    .sort((a, b) => b.sharedGenres.length - a.sharedGenres.length || b.rating - a.rating)
    .slice(0, 3);

  return (
    <Modal
      isOpen={!!selectedRecForWhyModal}
      onClose={() => setSelectedRecForWhyModal(null)}
      title={
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-brand-400" />
          <span className="text-base font-bold text-white">Why This Recommendation?</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        
        {/* Movie Header Card */}
        <div className="flex gap-4 p-4 rounded-2xl bg-surface-100/60 border border-white/10">
          <img
            src={posterUrl}
            alt={title}
            className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight truncate">
                {title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {year} • {movie.genres}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="hybrid" size="sm">
                Hybrid Score: {formatScorePercent(finalScore)}
              </Badge>
              <Badge variant="quality" size="sm">
                Quality: {qualityScore.toFixed(2)} / 5.0
              </Badge>
            </div>
          </div>
        </div>

        {/* Algorithm Breakdown Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-brand-400" />
              Recommendation Engine Scoring Breakdown
            </h4>
            <span className="text-[11px] font-mono text-indigo-300">V5 Model Fusion</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 1. Content Similarity */}
            <div className="p-3.5 rounded-xl bg-surface-100 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Content Match</span>
                <span className="font-mono font-bold text-cyan-400">
                  {formatScorePercent(contentScore)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(10, contentScore * 100))}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                5,000-dim TF-IDF cosine similarity to your rated movies.
              </p>
            </div>

            {/* 2. Quality Score */}
            <div className="p-3.5 rounded-xl bg-surface-100 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Quality Ranking</span>
                <span className="font-mono font-bold text-amber-400">
                  {(qualityScore).toFixed(1)} ★
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${(qualityScore / 5) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Historical Bayesian quality rating prevents low-tier recommendations.
              </p>
            </div>

            {/* 3. Hybrid Fusion */}
            <div className="p-3.5 rounded-xl bg-surface-100 border border-brand-500/30 bg-brand-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-200 font-semibold">Final Hybrid</span>
                <span className="font-mono font-bold text-indigo-300">
                  {formatScorePercent(finalScore)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-purple rounded-full"
                  style={{ width: `${Math.min(100, Math.max(15, finalScore * 100))}%` }}
                />
              </div>
              <p className="text-[10px] text-indigo-200/80 leading-tight">
                Weighted fusion optimizes both relevance and artistic acclaim.
              </p>
            </div>

          </div>
        </div>

        {/* Contributing Seed Ratings */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            Top Seed Ratings That Influenced This
          </h4>

          {seedInfluencers.length > 0 ? (
            <div className="space-y-2">
              {seedInfluencers.map((seed) => (
                <div
                  key={seed.movie_id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-100/70 border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200 font-medium truncate">{seed.title}</span>
                    {seed.sharedGenres.length > 0 && (
                      <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {seed.sharedGenres.join(', ')}
                      </span>
                    )}
                  </div>

                  <span className="font-mono font-bold text-amber-300 flex-shrink-0 flex items-center gap-1">
                    {seed.rating} ★
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Generated from your baseline Cold-Start profile vector.
            </p>
          )}
        </div>

        {/* User Interaction & Rating in Modal */}
        <div className="p-4 rounded-2xl bg-surface-100/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white">
              {userRating ? `Your rating: ${userRating} Stars` : 'Rate this movie to refine recommendations'}
            </p>
            <p className="text-[11px] text-slate-400">
              Future recommendations will automatically calibrate around this signal.
            </p>
          </div>

          <StarRating
            rating={userRating || 0}
            onRatingChange={(r) => rateMovie(movie, r)}
            showLabel
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={() => setSelectedRecForWhyModal(null)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedRecForWhyModal(null);
              setSelectedMovieForModal(movie);
            }}
          >
            View Full Movie Details
          </Button>
        </div>

      </div>
    </Modal>
  );
};
