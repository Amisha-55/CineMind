import React, { useState } from 'react';
import { useTaste } from '../context/TasteContext';
import { MovieCard } from '../components/movies/MovieCard';
import { Button } from '../components/ui/Button';
import { Bookmark, Eye, Star, Film, Sparkles, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    watchlist,
    removeFromWatchlist,
    toggleWatched,
    ratings,
    ratedMoviesDetails,
  } = useTaste();

  const [activeTab, setActiveTab] = useState<'all' | 'want_to_watch' | 'watched' | 'rated'>('all');

  const wantToWatchList = watchlist.filter((item) => item.status === 'want_to_watch');
  const watchedList = watchlist.filter((item) => item.status === 'watched');

  // Convert ratedMoviesDetails to items
  const ratedItems = Object.entries(ratings).map(([mIdStr, score]) => {
    const mId = Number(mIdStr);
    const detail = ratedMoviesDetails[mId] || {
      movie_id: mId,
      title: `Movie #${mId}`,
      genres: 'Drama',
      tmdb_id: 0,
      quality_score: score,
    };
    return {
      movie: detail,
      added_at: Date.now(),
      status: 'watched' as const,
      user_rating: score,
    };
  });

  let displayedItems = watchlist;
  if (activeTab === 'want_to_watch') displayedItems = wantToWatchList;
  else if (activeTab === 'watched') displayedItems = watchedList;
  else if (activeTab === 'rated') displayedItems = ratedItems;

  const tabs = [
    { id: 'all', label: 'All Saved', count: watchlist.length, icon: Bookmark },
    { id: 'want_to_watch', label: 'Want to Watch', count: wantToWatchList.length, icon: Film },
    { id: 'watched', label: 'Watched', count: watchedList.length, icon: Eye },
    { id: 'rated', label: 'Rated Seed History', count: ratedItems.length, icon: Star },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            My List & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your personal cinema backlog, watched log, and ratings.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate('/discover')}
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-400" />}
        >
          Add More Movies
        </Button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-glow-brand border border-brand-400/30'
                  : 'bg-surface-100 hover:bg-surface-50 text-slate-300 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Movies */}
      {displayedItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl border border-dashed border-white/10 bg-surface-100/40 p-8">
          <div className="w-16 h-16 rounded-2xl bg-surface-50 flex items-center justify-center text-slate-400 mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Your list is currently empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Save movies to your watchlist or mark them watched to build your personal library.
            </p>
          </div>
          <Button variant="glow" onClick={() => navigate('/discover')}>
            Browse Movie Catalog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {displayedItems.map((item) => (
            <div key={item.movie.movie_id} className="relative group/item">
              <MovieCard movie={item.movie} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
