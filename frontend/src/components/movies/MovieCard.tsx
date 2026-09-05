import React, { useState } from 'react';
import { Star, Plus, Check, Eye, Sparkles, Info } from 'lucide-react';
import { Movie } from '../../types';
import { getMoviePosterUrl, cleanMovieTitle, getStarRating } from '../../utils/movieUtils';
import { Badge } from '../ui/Badge';
import { useTaste } from '../../context/TasteContext';

interface MovieCardProps {
  movie: Movie;
  showRatingOverlay?: boolean;
  priority?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const {
    ratings,
    rateMovie,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    setSelectedMovieForModal,
  } = useTaste();

  const [isHovered, setIsHovered] = useState(false);
  const [showQuickRate, setShowQuickRate] = useState(false);

  const { title, year } = cleanMovieTitle(movie.title);
  const posterUrl = getMoviePosterUrl(movie);
  const userRating = ratings[movie.movie_id];
  const inWatchlist = watchlist.some(item => item.movie.movie_id === movie.movie_id);
  const isWatched = watchlist.some(
    item => item.movie.movie_id === movie.movie_id && item.status === 'watched'
  );

  const genres = movie.genres ? movie.genres.split('|').slice(0, 2) : [];
  const primaryGenre = genres[0] || 'Drama';

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.movie_id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleRate = (rating: number) => {
    rateMovie(movie, rating);
    setShowQuickRate(false);
  };

  return (
    <div
      className="group relative flex flex-col w-full rounded-2xl overflow-hidden glass-card cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickRate(false);
      }}
      onClick={() => setSelectedMovieForModal(movie)}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay for bottom text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F141F] via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges (Quality Score & User Rating) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
          <Badge variant="quality" size="sm" className="flex items-center gap-1 shadow-md backdrop-blur-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{getStarRating(movie.quality_score)}</span>
          </Badge>

          {userRating && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white shadow-glow-brand flex items-center gap-0.5">
              <span>{userRating}</span>
              <Star className="w-2.5 h-2.5 fill-white text-white" />
            </span>
          )}
        </div>

        {/* Hover Quick Actions Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] p-3 flex flex-col justify-between transition-opacity duration-200 z-20 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Quick Actions */}
          <div className="flex justify-end gap-1.5">
            <button
              onClick={handleWatchlistToggle}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                inWatchlist
                  ? 'bg-brand-600 border-brand-400 text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-200'
              }`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMovieForModal(movie);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 backdrop-blur-md transition-all cursor-pointer"
              title="Quick Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Quick Rate trigger */}
          <div className="space-y-2">
            {!showQuickRate ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickRate(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-brand-600/90 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {userRating ? `Rated ${userRating}★ (Change)` : 'Rate Movie'}
              </button>
            ) : (
              <div
                className="bg-[#0B0E17]/95 border border-white/15 p-2 rounded-xl flex items-center justify-around"
                onClick={(e) => e.stopPropagation()}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="p-1 hover:scale-125 transition-transform text-slate-400 hover:text-amber-400"
                    title={`Rate ${star} Stars`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        (userRating || 0) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movie Meta Information */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-1.5 bg-[#0F141F]">
        <div>
          <h4 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-brand-300 transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {year && <span className="text-xs text-slate-400 font-medium">{year}</span>}
            {isWatched && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                <Eye className="w-2.5 h-2.5" /> Watched
              </span>
            )}
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mt-1">
          {genres.map((g) => (
            <Badge key={g} variant="genre" genreName={g} size="sm">
              {g}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
