import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Sparkles, Bookmark, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/for-you', label: 'For You', icon: Sparkles, badge: 'ML' },
    { to: '/my-list', label: 'My List', icon: Bookmark },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080B10]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around safe-area-pb">
      {navItems.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-brand-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
