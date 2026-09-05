import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, CheckCircle, ArrowRight, Brain, Film, RotateCcw, ThumbsUp, Heart, MinusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTaste } from '../../context/TasteContext';
import { movieApi } from '../../api/movies';
import { Movie } from '../../types';
import { cleanMovieTitle, getMoviePosterUrl } from '../../utils/movieUtils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useNavigate } from 'react-router-dom';

const POPULAR_GENRES = [
  'Sci-Fi', 'Drama', 'Crime', 'Action', 'Comedy', 
  'Animation', 'Thriller', 'Romance', 'Adventure', 'Mystery'
];

export const OnboardingModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    completeOnboarding,
  } = useTaste();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Sci-Fi', 'Drama']);
  const [candidateMovies, setCandidateMovies] = useState<Movie[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState<boolean>(false);
  const [userRatings, setUserRatings] = useState<Record<number, { movie: Movie; rating: number }>>({});
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  // Load starter movies
  useEffect(() => {
    if (isOnboardingOpen) {
      loadStarterMovies();
    }
  }, [isOnboardingOpen]);

  const loadStarterMovies = async () => {
    setIsLoadingMovies(true);
    try {
      const res = await movieApi.getOnboardingCatalog();
      if (res.success && res.movies) {
        setCandidateMovies(res.movies);
      }
    } catch (err) {
      console.error('Failed to load starter movies', err);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleRateMovie = (movie: Movie, rating: number) => {
    setUserRatings(prev => ({
      ...prev,
      [movie.movie_id]: { movie, rating },
    }));
  };

  const removeRating = (movieId: number) => {
    setUserRatings(prev => {
      const copy = { ...prev };
      delete copy[movieId];
      return copy;
    });
  };

  const ratedCount = Object.keys(userRatings).length;
  const minRequired = 4;

  const handleFinishOnboarding = async () => {
    setStep(3);
    setIsSynthesizing(true);

    // Neural calibration simulation delay for rich product feel
    setTimeout(async () => {
      const ratingsArray = Object.values(userRatings);
      await completeOnboarding(ratingsArray);
      setIsSynthesizing(false);

      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#8B5CF6', '#F59E0B', '#10B981'],
      });

      setIsOnboardingOpen(false);
      navigate('/for-you');
    }, 2200);
  };

  // Filter movies matching selected genres for step 2
  const filteredCandidates = candidateMovies.filter(m => {
    if (selectedGenres.length === 0) return true;
    const glist = m.genres ? m.genres.split('|') : [];
    return glist.some(g => selectedGenres.includes(g));
  });

  const displayCandidates = filteredCandidates.length >= 8 ? filteredCandidates : candidateMovies;

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={() => setIsOnboardingOpen(false)}
      maxWidth="4xl"
      showCloseButton={step !== 3}
    >
      <div className="space-y-6">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Intelligent Taste Onboarding
              </h2>
              <p className="text-xs text-slate-400">
                Calibrating CineMind's ML hybrid profile for your taste
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-brand-500'
                    : s < step
                    ? 'w-4 bg-emerald-500'
                    : 'w-4 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Genre Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center max-w-lg mx-auto space-y-2">
              <h3 className="text-2xl font-display font-bold text-white">
                What styles of cinema resonate with you?
              </h3>
              <p className="text-xs text-slate-400">
                Select your favorite genres to seed your initial content vector dimensions.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {POPULAR_GENRES.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-brand-600/25 border-brand-500 text-white shadow-glow-brand'
                        : 'bg-surface-100 hover:bg-surface-50 border-white/5 text-slate-300'
                    }`}
                  >
                    <span className="text-sm font-semibold">{genre}</span>
                    <Badge variant={isSelected ? 'hybrid' : 'outline'} size="sm">
                      {isSelected ? 'Selected' : 'Add'}
                    </Badge>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-xs text-slate-400">
                {selectedGenres.length} genres selected
              </span>
              <Button
                variant="glow"
                disabled={selectedGenres.length === 0}
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Movie Ratings
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Movie Rating */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-100/60 p-4 rounded-2xl border border-white/5">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Rate {minRequired}+ movies you've experienced
                </h3>
                <p className="text-xs text-slate-400">
                  Ratings act as weighted multipliers for the TF-IDF vector sums.
                </p>
              </div>

              {/* Rating Progress Meter */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white">
                    {ratedCount} / {minRequired} Minimum
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {ratedCount >= minRequired ? 'Ready to calibrate!' : `${minRequired - ratedCount} more needed`}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center relative">
                  <span className="text-xs font-bold text-brand-300">{ratedCount}</span>
                  {ratedCount >= minRequired && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 absolute -top-1 -right-1" />
                  )}
                </div>
              </div>
            </div>

            {/* Candidate Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto pr-1">
              {displayCandidates.map((movie) => {
                const currentRating = userRatings[movie.movie_id]?.rating;
                const { title, year } = cleanMovieTitle(movie.title);
                const posterUrl = getMoviePosterUrl(movie);

                return (
                  <div
                    key={movie.movie_id}
                    className={`rounded-2xl p-3 border transition-all flex flex-col justify-between ${
                      currentRating
                        ? 'bg-brand-950/40 border-brand-500/50 shadow-glow-brand'
                        : 'bg-surface-100 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-900 relative">
                        <img
                          src={posterUrl}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                        {currentRating && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-500 text-white text-xs font-bold shadow-lg">
                            {currentRating} ★
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{title}</h4>
                        <p className="text-[10px] text-slate-400">{year} • {movie.genres.split('|')[0]}</p>
                      </div>
                    </div>

                    {/* Quick Rating Buttons */}
                    <div className="pt-2 border-t border-white/5 mt-2">
                      <div className="flex items-center justify-between">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateMovie(movie, star)}
                            className="p-1 hover:scale-125 transition-transform text-slate-500 hover:text-amber-400 cursor-pointer"
                            title={`Rate ${star} Stars`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                (currentRating || 0) >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-transparent'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {currentRating && (
                        <button
                          onClick={() => removeRating(movie.movie_id)}
                          className="text-[10px] text-slate-500 hover:text-rose-400 mt-1 w-full text-center"
                        >
                          Clear rating
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back to Genres
              </Button>

              <Button
                variant="glow"
                disabled={ratedCount < minRequired}
                onClick={handleFinishOnboarding}
                rightIcon={<Sparkles className="w-4 h-4 text-indigo-200" />}
              >
                Synthesize My CineMind DNA
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Learning Taste Synthesis Animation */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-brand-600 to-accent-purple animate-spin" />
              <div className="relative w-20 h-20 rounded-full bg-[#0F141F] flex items-center justify-center text-brand-300 shadow-glow-brand">
                <Brain className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-display font-bold text-white">
                Learning your taste...
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Building normalized TF-IDF user preference vector across 5,000 keyword dimensions and fusing with Bayesian quality rankings.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-indigo-300 bg-brand-500/10 px-4 py-2 rounded-xl border border-brand-500/20">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>Calibrating V5 Recommender Matrix...</span>
            </div>
          </motion.div>
        )}

      </div>
    </Modal>
  );
};
