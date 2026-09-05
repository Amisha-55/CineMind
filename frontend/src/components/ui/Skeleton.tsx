import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(clsx('rounded-xl skeleton-shimmer bg-slate-800/40', className))}
      {...props}
    />
  );
};

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Skeleton className="w-full aspect-[2/3] rounded-2xl" />
      <Skeleton className="w-3/4 h-4 rounded-md" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-12 h-3 rounded-md" />
        <Skeleton className="w-16 h-3 rounded-md" />
      </div>
    </div>
  );
};

export const MovieRowSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="flex gap-4 overflow-hidden py-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-44 sm:w-52">
          <MovieCardSkeleton />
        </div>
      ))}
    </div>
  );
};
