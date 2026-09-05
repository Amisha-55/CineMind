import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Film, Search, Sparkles, User as UserIcon, Bookmark, Compass, Sparkle, LogOut, ChevronDown } from 'lucide-react';
import { useTaste } from '../../context/TasteContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { ratings, setIsOnboardingOpen, setIsAuthOpen } = useTaste();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const ratedCount = Object.keys(ratings).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/for-you', label: 'For You', icon: Sparkle, badge: 'ML' },
    { to: '/moods', label: 'Moods' },
    { to: '/my-list', label: 'My List', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#080B10]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-indigo-600 to-accent-purple p-[1px] shadow-glow-brand transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#080B10] rounded-[11px] flex items-center justify-center">
                <Film className="w-5 h-5 text-brand-400 group-hover:text-brand-300 transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-xl font-display font-bold tracking-tight text-white flex items-center gap-1.5">
                CineMind
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  AI
                </span>
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-white/10 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                {link.label}
                {link.badge && (
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Section: Search, Taste Status, Auth */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 3,800+ movies..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F141F] border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all"
            />
          </form>

          {/* Taste DNA Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="hidden sm:flex text-xs border border-brand-500/30 hover:border-brand-500/50 bg-brand-500/10 text-brand-300 gap-1.5"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-400" />}
          >
            Taste DNA ({ratedCount})
          </Button>

          {/* Authenticated User Menu or Sign In */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-surface-100/70 border border-white/10 hover:border-brand-500/40 transition-all cursor-pointer group"
                aria-expanded={isUserMenuOpen}
                aria-label="User profile menu"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-brand-600/30 flex items-center justify-center border border-brand-500/30">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-brand-300" />
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-slate-200 group-hover:text-white max-w-[110px] truncate">
                  {user.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0F141F] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User info header */}
                  <div className="px-3 py-2.5 border-b border-white/5 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  {/* Links */}
                  <NavLink
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-brand-400" />
                    <span>My Profile & Taste DNA</span>
                  </NavLink>

                  <NavLink
                    to="/my-list"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-accent-cyan" />
                    <span>My Watchlist & History</span>
                  </NavLink>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsOnboardingOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Recalibrate Taste DNA</span>
                  </button>

                  <div className="border-t border-white/5 my-1" />

                  {/* Log Out Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors text-left font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              variant="glow"
              onClick={() => setIsAuthOpen(true)}
              className="text-xs font-semibold px-4 py-2"
            >
              Sign In
            </Button>
          )}

        </div>
      </div>
    </header>
  );
};
