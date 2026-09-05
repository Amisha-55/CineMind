import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GENRE_COLORS, DEFAULT_GENRE_COLOR } from '../../utils/movieUtils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'genre' | 'quality' | 'hybrid' | 'outline' | 'amber';
  genreName?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  genreName,
  size = 'sm',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide transition-colors';

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  let variantStyles = 'bg-white/10 text-slate-200 border border-white/10';

  if (variant === 'genre' && genreName) {
    const gc = GENRE_COLORS[genreName] || DEFAULT_GENRE_COLOR;
    variantStyles = `${gc.bg} ${gc.text} ${gc.border} border`;
  } else if (variant === 'quality') {
    variantStyles = 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold';
  } else if (variant === 'hybrid') {
    variantStyles = 'bg-gradient-to-r from-brand-600/30 to-accent-purple/30 text-indigo-300 border border-indigo-400/30 font-semibold shadow-inner-glow';
  } else if (variant === 'amber') {
    variantStyles = 'bg-amber-400/20 text-amber-300 border border-amber-400/30';
  } else if (variant === 'outline') {
    variantStyles = 'bg-transparent text-slate-400 border border-white/15';
  }

  return (
    <span
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles, className))}
      {...props}
    >
      {children}
    </span>
  );
};
