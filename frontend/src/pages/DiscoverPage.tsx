import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, Filter, X, ArrowUpDown } from 'lucide-react';
import { movieApi } from '../api/movies';
import { Movie } from '../types';
import { MovieGrid } from '../components/movies/MovieGrid';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const GENRE_LIST = [
  'All', 'Action', 'Adventure', 'Animation', "Children's", 'Comedy', 
  'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 
  'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

export const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const queryParam = searchParams.get('search') || '';
  const genreParam = searchParams.get('genre') || 'All';

  const [query, setQuery] = useState<string>(queryParam);
  const [selectedGenre, setSelectedGenre] = useState<string>(genreParam);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [minYear, setMinYear] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'popular' | 'quality' | 'year_desc' | 'year_asc' | 'title'>('popular');
  const [page, setPage] = useState<number>(1);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Sync state with URL params
  useEffect(() => {
    if (queryParam !== query) setQuery(queryParam);
    if (genreParam !== selectedGenre) setSelectedGenre(genreParam);
  }, [queryParam, genreParam]);

  // Fetch movies when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMovies();
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedGenre, minRating, minYear, sortBy, page]);

  const loadMovies = async () => {
    setIsLoading(true);
    try {
      const res = await movieApi.getMovies({
        query: query.trim() || undefined,
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        min_rating: minRating,
        min_year: minYear,
        sort_by: sortBy,
        page,
        limit: 24,
      });

      if (res.success) {
        setMovies(res.movies);
        setTotalPages(res.total_pages);
        setTotalCount(res.total);
      }
    } catch (err) {
      console.error('Failed to load discover movies', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (genre === 'All') {
      newParams.delete('genre');
    } else {
      newParams.set('genre', genre);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const resetAllFilters = () => {
    setQuery('');
    setSelectedGenre('All');
    setMinRating(undefined);
    setMinYear(undefined);
    setSortBy('popular');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = query || selectedGenre !== 'All' || minRating !== undefined || minYear !== undefined || sortBy !== 'popular';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Discover Cinema
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Explore 3,880+ curated titles across 18 genres with precision filtering.
          </p>
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button size="sm" variant="ghost" onClick={resetAllFilters} className="text-xs text-rose-400">
              Clear All
            </Button>
          )}

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          >
            {showFilterDrawer ? 'Hide Filters' : 'Filters & Sort'}
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by movie title (e.g. Pulp Fiction, Matrix, Star Wars)..."
          value={query}
          onChange={handleSearchChange}
          className="w-full bg-surface-100 border border-white/10 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-lg"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('search');
              setSearchParams(newParams);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Genre Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
        {GENRE_LIST.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => handleGenreSelect(genre)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-glow-brand border border-brand-400/30'
                  : 'bg-surface-100 hover:bg-surface-50 text-slate-300 border border-white/5'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Collapsible Advanced Filters Drawer */}
      {showFilterDrawer && (
        <div className="p-5 rounded-2xl bg-surface-100 border border-white/10 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Sort Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
                className="w-full bg-surface-200 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="popular">Popular (TMDB Aligned)</option>
                <option value="quality">Highest Quality Rating</option>
                <option value="year_desc">Newest Release First</option>
                <option value="year_asc">Oldest Classics First</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Minimum Quality Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Minimum Rating</label>
              <select
                value={minRating === undefined ? 'all' : minRating.toString()}
                onChange={(e) => {
                  setMinRating(e.target.value === 'all' ? undefined : Number(e.target.value));
                  setPage(1);
                }}
                className="w-full bg-surface-200 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="all">Any Rating</option>
                <option value="3.5">3.5+ Stars & Above</option>
                <option value="4.0">4.0+ Stars (Masterpieces)</option>
                <option value="4.3">4.3+ Stars (Elite Tier)</option>
              </select>
            </div>

            {/* Era / Year Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Release Era</label>
              <select
                value={minYear === undefined ? 'all' : minYear.toString()}
                onChange={(e) => {
                  setMinYear(e.target.value === 'all' ? undefined : Number(e.target.value));
                  setPage(1);
                }}
                className="w-full bg-surface-200 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Eras</option>
                <option value="1990">1990s & 2000s</option>
                <option value="1980">1980s and Newer</option>
                <option value="1970">1970s and Newer</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{movies.length}</strong> of{' '}
          <strong className="text-white">{totalCount}</strong> movies
        </span>
      </div>

      {/* Movie Grid */}
      <MovieGrid
        movies={movies}
        isLoading={isLoading}
        emptyMessage="Try adjusting your search query or loosening your genre and rating filters."
        onResetFilters={resetAllFilters}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
};
