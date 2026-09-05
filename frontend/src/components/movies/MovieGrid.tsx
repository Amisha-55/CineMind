import React from 'react';
import { Movie } from '../../types';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from '../ui/Skeleton';
import { Film } from 'lucide-react';
import { Button } from '../ui/Button';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading = false,
  emptyMessage = 'No movies matched your current filters.',
  onResetFilters,
  page = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl border border-dashed border-white/10 bg-surface-200/30 p-8">
        <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center text-slate-400">
          <Film className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">No Movies Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">{emptyMessage}</p>
        </div>
        {onResetFilters && (
          <Button size="sm" variant="secondary" onClick={onResetFilters}>
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.movie_id} movie={movie} />
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-white/5">
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>

          <span className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-surface-100 border border-white/5">
            Page <strong className="text-white">{page}</strong> of {totalPages}
          </span>

          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
