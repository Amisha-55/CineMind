import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/movies/HeroBanner';
import { MovieRow } from '../components/movies/MovieRow';
import { useTaste } from '../context/TasteContext';
import { movieApi } from '../api/movies';
import { Movie } from '../types';
import { MOOD_PRESETS } from '../utils/movieUtils';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Flame, Award, Heart, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    recommendations,
    isLoadingRecommendations,
    ratings,
    setIsOnboardingOpen,
  } = useTaste();

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [sciFiMovies, setSciFiMovies] = useState<Movie[]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState<boolean>(true);

  useEffect(() => {
    loadHomeMovieRows();
  }, []);

  const loadHomeMovieRows = async () => {
    setIsLoadingRows(true);
    try {
      const [popRes, topRes, scifiRes] = await Promise.all([
        movieApi.getMovies({ sort_by: 'popular', limit: 12 }),
        movieApi.getMovies({ sort_by: 'quality', min_rating: 4.0, limit: 12 }),
        movieApi.getMovies({ genre: 'Sci-Fi', sort_by: 'quality', limit: 12 }),
      ]);

      if (popRes.success) setPopularMovies(popRes.movies);
      if (topRes.success) setTopRatedMovies(topRes.movies);
      if (scifiRes.success) setSciFiMovies(scifiRes.movies);
    } catch (err) {
      console.error('Failed to load home movie rows', err);
    } finally {
      setIsLoadingRows(false);
    }
  };

  const ratedCount = Object.keys(ratings).length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Cinematic Hero Banner */}
      <HeroBanner featuredMovie={popularMovies[0]} />

      {/* 2. Made For You Row (Live ML Recommendations) */}
      <div className="relative">
        <MovieRow
          title="Made For You"
          subtitle={
            ratedCount > 0
              ? `Personalized hybrid stream tailored to your ${ratedCount} rated films`
              : 'Cold-start recommendation stream (Rate movies to personalize)'
          }
          movies={recommendations}
          isLoading={isLoadingRecommendations}
          tag="V5 ML Model"
        />
      </div>

      {/* 3. Explore By Mood Carousel */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-purple" />
              Explore By Mood
            </h3>
            <p className="text-xs text-slate-400">
              Curated tonal vibes mapped to thematic cinematic attributes
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/moods')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            All Moods
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {MOOD_PRESETS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => navigate(`/moods?mood=${mood.id}`)}
              className="p-3.5 rounded-2xl bg-surface-100 hover:bg-surface-50 border border-white/5 hover:border-brand-500/40 text-left transition-all hover:scale-105 cursor-pointer flex flex-col justify-between h-28 group"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: `${mood.accentColor}25`, border: `1px solid ${mood.accentColor}40` }}
              >
                <Sparkles className="w-4 h-4" style={{ color: mood.accentColor }} />
              </div>

              <div>
                <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                  {mood.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {mood.genres[0]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Trending Classics */}
      <MovieRow
        title="Trending Classics & Essentials"
        subtitle="Iconic cinema matched to TMDB canonical entries"
        movies={popularMovies}
        isLoading={isLoadingRows}
      />

      {/* 5. Critically Acclaimed (Quality >= 4.0) */}
      <MovieRow
        title="Critically Acclaimed Masterpieces"
        subtitle="Top Bayesian historical quality ratings across 1M+ user reviews"
        movies={topRatedMovies}
        isLoading={isLoadingRows}
        tag="Bayesian Ranked"
      />

      {/* 6. Sci-Fi & Mind Bending */}
      <MovieRow
        title="Sci-Fi & Reality Shifters"
        subtitle="Futuristic visions, cyberpunk classics, and mind-bending space epics"
        movies={sciFiMovies}
        isLoading={isLoadingRows}
      />

      {/* 7. Taste Calibration Banner */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-900/40 via-surface-100 to-surface-100 border border-brand-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-display font-bold text-white">
              Ready to calibrate your movie DNA?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Rate 5 or more movies in our quick onboarding flow to teach CineMind your exact taste profile and unlock hyper-personalized recommendations.
            </p>
          </div>

          <Button
            size="lg"
            variant="glow"
            onClick={() => setIsOnboardingOpen(true)}
            leftIcon={<Sparkles className="w-5 h-5 text-indigo-200" />}
          >
            Launch Onboarding
          </Button>
        </div>
      </section>

    </div>
  );
};
