import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Disliked',
  2: 'Not for me',
  3: "It's okay",
  4: 'Liked it',
  5: 'Loved it!',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readOnly = false,
  size = 'md',
  showLabel = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => !readOnly && setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map(star => {
          const isFilled = activeRating >= star;
          const isHalf = !isFilled && activeRating >= star - 0.5;

          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={e => {
                e.stopPropagation();
                if (!readOnly && onRatingChange) {
                  onRatingChange(star);
                }
              }}
              onMouseEnter={() => !readOnly && setHoverRating(star)}
              className={`p-0.5 transition-transform duration-150 focus:outline-none ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-125 active:scale-95'
              }`}
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-transparent text-slate-600 hover:text-slate-400'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showLabel && activeRating > 0 && (
        <span className="text-xs font-medium text-amber-300/90 ml-1 min-w-16">
          {RATING_LABELS[Math.round(activeRating)] || `${activeRating.toFixed(1)} ★`}
        </span>
      )}
    </div>
  );
};
