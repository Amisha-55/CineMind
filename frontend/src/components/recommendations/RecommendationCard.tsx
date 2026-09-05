import React from 'react';
import { Star, Sparkles, HelpCircle, Plus, Check, Eye } from 'lucide-react';
import { RecommendationMovie } from '../../types';
import { getMoviePosterUrl, cleanMovieTitle, getStarRating, formatScorePercent } from '../../utils/movieUtils';
import { Badge } from '../ui/Badge';
import { useTaste } from '../../context/TasteContext';

interface RecommendationCardProps {
  movie: RecommendationMovie;
  rank?: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ movie, rank }) => {
  const {
    ratings,
    rateMovie,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    setSelectedMovieForModal,
    setSelectedRecForWhyModal,
  } = useTaste();

  const { title, year } = cleanMovieTitle(movie.title);
  const posterUrl = getMoviePosterUrl(movie);
  const userRating = ratings[movie.movie_id];
  const inWatchlist = watchlist.some(item => item.movie.movie_id === movie.movie_id);
  const isWatched = watchlist.some(
    item => item.movie.movie_id === movie.movie_id && item.status === 'watched'
  );

  const genres = movie.genres ? movie.genres.split('|').slice(0, 2) : [];

  // Match confidence score percentage (0 to 100%)
  const matchPercent = formatScorePercent(movie.final_score);
  const contentScorePercent = movie.content_score ? formatScorePercent(movie.content_score) : null;

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.movie_id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div
      className="group relative flex flex-col w-full rounded-2xl overflow-hidden glass-card cursor-pointer border border-brand-500/20 hover:border-brand-500/50 shadow-xl"
      onClick={() => setSelectedMovieForModal(movie)}
    >
      {/* Rank Indicator */}
      {rank !== undefined && (
        <div className="absolute top-2.5 left-2.5 z-20 w-7 h-7 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-white shadow-lg">
          #{rank}
        </div>
      )}

      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F141F] via-transparent to-black/30 opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Top Right Hybrid Match Badge */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <Badge variant="hybrid" size="sm" className="flex items-center gap-1 shadow-glow-brand">
            <Sparkles className="w-3 h-3 text-brand-300" />
            <span>{matchPercent} Match</span>
          </Badge>
        </div>

        {/* Bottom Poster Overlay with Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
          <Badge variant="quality" size="sm" className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{getStarRating(movie.quality_score)}</span>
          </Badge>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleWatchlistToggle}
              className={`p-1.5 rounded-lg border backdrop-blur-md transition-all cursor-pointer ${
                inWatchlist
                  ? 'bg-brand-600 border-brand-400 text-white'
                  : 'bg-black/60 hover:bg-black/80 border-white/20 text-slate-200'
              }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Movie Details & ML Explanation Trigger */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5 bg-[#0F141F]">
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-brand-300 transition-colors">
            {title}
          </h4>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>{year || '1990s'}</span>
            {contentScorePercent && (
              <span className="text-[11px] font-mono text-indigo-300">
                Content: {contentScorePercent}
              </span>
            )}
          </div>
        </div>

        {/* Genre Badges */}
        <div className="flex flex-wrap gap-1">
          {genres.map((g) => (
            <Badge key={g} variant="genre" genreName={g} size="sm">
              {g}
            </Badge>
          ))}
        </div>

        {/* 'Why this recommendation?' Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRecForWhyModal(movie);
          }}
          className="w-full py-2 px-3 rounded-xl bg-surface-50 hover:bg-surface-100 border border-white/10 hover:border-brand-500/30 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
          <span>Why this recommendation?</span>
        </button>
      </div>
    </div>
  );
};
