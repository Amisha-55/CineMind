import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Brain, Flame, Laugh, Moon, Heart, Compass, Skull } from 'lucide-react';
import { MOOD_PRESETS } from '../utils/movieUtils';
import { movieApi } from '../api/movies';
import { Movie, MoodPreset } from '../types';
import { MovieGrid } from '../components/movies/MovieGrid';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Brain,
  Sparkles,
  Flame,
  Laugh,
  Moon,
  Heart,
  Compass,
  Skull,
};

export const MoodExplorerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMoodId = searchParams.get('mood') || 'mind-bending';

  const [activeMood, setActiveMood] = useState<MoodPreset>(() => {
    return MOOD_PRESETS.find((m) => m.id === currentMoodId) || MOOD_PRESETS[0];
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const found = MOOD_PRESETS.find((m) => m.id === currentMoodId);
    if (found) {
      setActiveMood(found);
    }
  }, [currentMoodId]);

  useEffect(() => {
    loadMoodMovies();
  }, [activeMood, page]);

  const loadMoodMovies = async () => {
    setIsLoading(true);
    try {
      const res = await movieApi.getMovies({
        mood: activeMood.id,
        sort_by: 'quality',
        page,
        limit: 18,
      });

      if (res.success) {
        setMovies(res.movies);
        setTotalPages(res.total_pages);
      }
    } catch (err) {
      console.error('Failed to load mood movies', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = (mood: MoodPreset) => {
    setActiveMood(mood);
    setPage(1);
    setSearchParams({ mood: mood.id });
  };

  const IconComponent = ICON_MAP[activeMood.icon] || Sparkles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Mood Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Match your current state of mind with tailored cinematic tonal vibes.
        </p>
      </div>

      {/* Mood Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {MOOD_PRESETS.map((mood) => {
          const isSelected = mood.id === activeMood.id;
          const Icon = ICON_MAP[mood.icon] || Sparkles;

          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                isSelected
                  ? 'bg-surface-50 border-brand-500 shadow-glow-brand scale-105'
                  : 'bg-surface-100 hover:bg-surface-50 border-white/5 hover:border-white/20'
              }`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${mood.accentColor}25`,
                  border: `1px solid ${mood.accentColor}40`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: mood.accentColor }} />
              </div>

              <div>
                <span className="text-xs font-bold text-white block truncate">
                  {mood.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {mood.genres.slice(0, 2).join(', ')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Mood Hero Spotlight */}
      <div
        className={`p-8 sm:p-10 rounded-3xl bg-gradient-to-r ${activeMood.gradient} border border-white/15 relative overflow-hidden shadow-2xl`}
      >
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs font-semibold text-white">
            <IconComponent className="w-4 h-4" style={{ color: activeMood.accentColor }} />
            <span>Active Mood: {activeMood.name}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {activeMood.tagline}
          </h2>

          <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed">
            {activeMood.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {activeMood.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 rounded-lg bg-black/50 text-white border border-white/10 text-xs font-medium"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Matching Active Mood */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Curated {activeMood.name} Selections
          </h3>
          <span className="text-xs text-slate-400">
            Ordered by historical quality score
          </span>
        </div>

        <MovieGrid
          movies={movies}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
        />
      </div>

    </div>
  );
};
