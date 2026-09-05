import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { Button } from './Button';
import { useTaste } from '../../context/TasteContext';

export const PendingTasteToast: React.FC = () => {
  const {
    hasPendingTasteUpdate,
    fetchRecommendations,
    clearPendingTasteUpdate,
    isLoadingRecommendations,
  } = useTaste();

  return (
    <AnimatePresence>
      {hasPendingTasteUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 max-w-sm"
        >
          <div className="bg-[#141B2D]/95 border border-brand-500/40 backdrop-blur-xl p-4 rounded-2xl shadow-2xl shadow-brand-500/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1 pr-1">
              <p className="text-xs font-semibold text-white">Taste DNA Updated</p>
              <p className="text-[11px] text-slate-300">
                New rating added. Sync and evolve recommendations?
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button
                size="sm"
                variant="glow"
                isLoading={isLoadingRecommendations}
                onClick={() => fetchRecommendations()}
                leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecommendations ? 'animate-spin' : ''}`} />}
              >
                Refresh
              </Button>

              <button
                onClick={clearPendingTasteUpdate}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
