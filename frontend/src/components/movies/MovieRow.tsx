import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Movie } from '../../types';
import { MovieCard } from './MovieCard';
import { MovieRowSkeleton } from '../ui/Skeleton';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  isLoading?: boolean;
  tag?: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  subtitle,
  movies,
  isLoading = false,
  tag,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-4 space-y-3 group/row">
      {/* Row Header */}
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            {tag && (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {tag}
              </span>
            )}
            <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
              {title}
            </h3>
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Scroll Nav Buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-xl bg-surface-50 hover:bg-surface-100 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-xl bg-surface-50 hover:bg-surface-100 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row Content Container */}
      <div className="relative">
        {isLoading ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <MovieRowSkeleton count={6} />
          </div>
        ) : movies.length === 0 ? (
          <div className="px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-slate-500">
            No movies available in this category.
          </div>
        ) : (
          <div
            ref={rowRef}
            className="flex gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 py-2 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((movie) => (
              <div
                key={movie.movie_id}
                className="flex-shrink-0 w-38 sm:w-48 lg:w-52 snap-start"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
