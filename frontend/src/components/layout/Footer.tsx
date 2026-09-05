import React from 'react';
import { Film, Cpu, Database, Award, Heart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07090D] pt-12 pb-24 md:pb-12 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-lg font-display font-bold text-white tracking-tight">
                CineMind
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Movies you'll love. Recommendations that learn you. Powered by a hybrid TF-IDF content similarity and SVD quality-aware ranking engine.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Discovery
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <NavLink to="/for-you" className="hover:text-brand-400 transition-colors">
                  Personalized For You
                </NavLink>
              </li>
              <li>
                <NavLink to="/discover" className="hover:text-brand-400 transition-colors">
                  Browse Catalog
                </NavLink>
              </li>
              <li>
                <NavLink to="/moods" className="hover:text-brand-400 transition-colors">
                  Mood Explorer
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-list" className="hover:text-brand-400 transition-colors">
                  My Watchlist
                </NavLink>
              </li>
            </ul>
          </div>

          {/* ML Architecture Specs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              ML Architecture
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-brand-400" />
                <span>TF-IDF Content Matrix (5,000 dim)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Database className="w-3.5 h-3.5 text-accent-cyan" />
                <span>MovieLens 1M & TMDB Alignment</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-3.5 h-3.5 text-accent-amber" />
                <span>Quality-Aware Bayesian Ranking</span>
              </div>
            </div>
          </div>

          {/* Tagline & System Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Engine Status
            </h4>
            <div className="p-3 rounded-xl bg-surface-100/80 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Recommender V5</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                Normalized hybrid content-quality fusion
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CineMind. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for cinema lovers & ML discovery.
          </p>
        </div>
      </div>
    </footer>
  );
};
