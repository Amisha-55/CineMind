import { MoodPreset } from '../types';

// Genre Colors & Styles
export const GENRE_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  'Action': { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', glow: 'rgba(239, 68, 68, 0.3)' },
  'Adventure': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'rgba(245, 158, 11, 0.3)' },
  'Animation': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'rgba(16, 185, 129, 0.3)' },
  "Children's": { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30', glow: 'rgba(20, 184, 166, 0.3)' },
  'Comedy': { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'rgba(234, 179, 8, 0.3)' },
  'Crime': { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'rgba(249, 115, 22, 0.3)' },
  'Documentary': { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'rgba(59, 130, 246, 0.3)' },
  'Drama': { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30', glow: 'rgba(99, 102, 241, 0.3)' },
  'Fantasy': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'rgba(168, 85, 247, 0.3)' },
  'Film-Noir': { bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30', glow: 'rgba(100, 116, 139, 0.3)' },
  'Horror': { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', glow: 'rgba(244, 63, 94, 0.3)' },
  'Musical': { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30', glow: 'rgba(217, 70, 239, 0.3)' },
  'Mystery': { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30', glow: 'rgba(139, 92, 246, 0.3)' },
  'Romance': { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-500/30', glow: 'rgba(236, 72, 153, 0.3)' },
  'Sci-Fi': { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'rgba(6, 182, 212, 0.3)' },
  'Thriller': { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', glow: 'rgba(14, 165, 233, 0.3)' },
  'War': { bg: 'bg-stone-500/15', text: 'text-stone-300', border: 'border-stone-500/30', glow: 'rgba(120, 113, 108, 0.3)' },
  'Western': { bg: 'bg-amber-700/20', text: 'text-amber-300', border: 'border-amber-700/40', glow: 'rgba(180, 83, 9, 0.3)' }
};

export const DEFAULT_GENRE_COLOR = {
  bg: 'bg-indigo-500/15',
  text: 'text-indigo-400',
  border: 'border-indigo-500/30',
  glow: 'rgba(99, 102, 241, 0.3)'
};

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'mind-bending',
    name: 'Mind Bending',
    tagline: 'Twisted narratives & reality-shifting depth',
    description: 'Complex Sci-Fi, psychological thrillers, and layered mysteries that demand your full focus.',
    icon: 'Brain',
    gradient: 'from-violet-600/30 via-indigo-900/40 to-cyan-900/30',
    genres: ['Sci-Fi', 'Mystery', 'Thriller'],
    accentColor: '#8B5CF6'
  },
  {
    id: 'feel-good',
    name: 'Feel Good',
    tagline: 'Heartwarming, uplifting, pure joy',
    description: 'Delightful comedies, inspiring adventures, and charming stories that leave you smiling.',
    icon: 'Sparkles',
    gradient: 'from-amber-500/30 via-orange-900/40 to-yellow-900/30',
    genres: ['Animation', 'Comedy', 'Adventure', "Children's", 'Romance'],
    accentColor: '#F59E0B'
  },
  {
    id: 'high-energy',
    name: 'High Energy',
    tagline: 'Adrenaline rushes & explosive stakes',
    description: 'Non-stop action spectacles, intense thrillers, and breathless escapades.',
    icon: 'Flame',
    gradient: 'from-red-600/30 via-rose-900/40 to-orange-900/30',
    genres: ['Action', 'Adventure', 'Thriller'],
    accentColor: '#EF4444'
  },
  {
    id: 'make-me-laugh',
    name: 'Make Me Laugh',
    tagline: 'Witty satires & side-splitting classics',
    description: 'Top-tier comedic masterpieces from legendary creators and brilliant ensembles.',
    icon: 'Laugh',
    gradient: 'from-yellow-500/30 via-amber-900/40 to-lime-900/30',
    genres: ['Comedy'],
    accentColor: '#EAB308'
  },
  {
    id: 'keep-me-up',
    name: 'Keep Me Up',
    tagline: 'Tension, shadows & psychological dread',
    description: 'Gripping suspense, terrifying encounters, and dark cat-and-mouse thrillers.',
    icon: 'Moon',
    gradient: 'from-slate-700/40 via-red-950/40 to-black',
    genres: ['Horror', 'Thriller', 'Crime'],
    accentColor: '#F43F5E'
  },
  {
    id: 'romance',
    name: 'Romance & Chemistry',
    tagline: 'Passionate tales & timeless connections',
    description: 'Emotional journeys exploring intimacy, desire, heartbreak, and profound love.',
    icon: 'Heart',
    gradient: 'from-pink-600/30 via-purple-900/40 to-rose-950/30',
    genres: ['Romance', 'Drama'],
    accentColor: '#EC4899'
  },
  {
    id: 'escape-reality',
    name: 'Escape Reality',
    tagline: 'Vast worldbuilding & mythical realms',
    description: 'Immersive fantasies, futuristic galaxies, and otherworldly epics.',
    icon: 'Compass',
    gradient: 'from-cyan-600/30 via-blue-900/40 to-purple-900/30',
    genres: ['Fantasy', 'Sci-Fi', 'Animation', 'Adventure'],
    accentColor: '#06B6D4'
  },
  {
    id: 'dark-twisted',
    name: 'Dark & Twisted',
    tagline: 'Noir shadows & morally gray antiheroes',
    description: 'Gritty crime masterclasses, neo-noir atmospheres, and chilling mysteries.',
    icon: 'Skull',
    gradient: 'from-zinc-700/40 via-purple-950/50 to-neutral-950',
    genres: ['Film-Noir', 'Crime', 'Mystery'],
    accentColor: '#A855F7'
  }
];

// Clean titles like "Godfather, The (1972)" -> "The Godfather"
export function cleanMovieTitle(rawTitle: string): { title: string; year: string } {
  if (!rawTitle) return { title: 'Unknown Movie', year: '' };

  let title = rawTitle;
  let year = '';

  const yearMatch = rawTitle.match(/\((\d{4})\)/);
  if (yearMatch) {
    year = yearMatch[1];
    title = title.replace(/\(\d{4}\)/, '').trim();
  }

  // Handle trailing articles: "Shawshank Redemption, The" -> "The Shawshank Redemption"
  const trailingArticles = [', The', ', A', ', An', ', Le', ', La', ', Les', ', El', ', Il'];
  for (const article of trailingArticles) {
    if (title.endsWith(article)) {
      const art = article.replace(', ', '').trim();
      title = `${art} ${title.slice(0, -article.length)}`.trim();
      break;
    }
  }

  return { title, year };
}

// Curated high quality poster bank for prominent classic movies + dynamic fallback
const POSTER_CACHE: Record<number, string> = {
  1: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', // Toy Story
  318: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg', // Shawshank Redemption
  858: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', // The Godfather
  50: 'https://image.tmdb.org/t/p/w500/b1xCNnyrPebIc7vKoDM93AcVeaK.jpg', // The Usual Suspects
  527: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', // Schindler's List
  1198: 'https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg', // Raiders of the Lost Ark
  260: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg', // Star Wars
  1196: 'https://image.tmdb.org/t/p/w500/7BuH8itoSrLExs2YZSsM01Qk2no.jpg', // Empire Strikes Back
  296: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', // Pulp Fiction
  1625: 'https://image.tmdb.org/t/p/w500/vQneK0pY9B8H7cff0jBcfbXwJ4S.jpg', // The Game
  924: 'https://image.tmdb.org/t/p/w500/ve72VxNqjGM69UmKAdORW9LiFvP.jpg', // 2001 Space Odyssey
  1136: 'https://image.tmdb.org/t/p/w500/hEP5bA4WjI4YxK8Pj3vI9t731sK.jpg', // Monty Python
  1262: 'https://image.tmdb.org/t/p/w500/mXp1bS79pSgY0o2VwM6Gq2gP50V.jpg', // Great Escape
  3897: 'https://image.tmdb.org/t/p/w500/6kM2nQo1P9fP2aJ4g3oV8h6a7lO.jpg', // Almost Famous
  2571: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', // The Matrix
  2762: 'https://image.tmdb.org/t/p/w500/vI37R97P0vW94998p7y27WqXw4H.jpg', // Sixth Sense
  593: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I0429O9s8m7h5.jpg', // Silence of the Lambs
  1097: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6amxQoikUzHg.jpg', // E.T.
  1270: 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553P.jpg', // Back to the Future
  356: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg', // Forrest Gump
  589: 'https://image.tmdb.org/t/p/w500/5M0Ah0SIsVA3Mw9TvBkAQnwYRT7.jpg', // Terminator 2
  2858: 'https://image.tmdb.org/t/p/w500/wGE4PvvTqgVbE1JcQn0xP0V9u8v.jpg', // American Beauty
  1214: 'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzmu2u0VjN5S.jpg', // Alien
  1200: 'https://image.tmdb.org/t/p/w500/b1bd57N0v1o2lU2f782X7298M1v.jpg', // Aliens
  480: 'https://image.tmdb.org/t/p/w500/oU7Oq4kTrIalDZ42lsI3wz9v9Un.jpg', // Jurassic Park
};

// Generate high quality procedural SVG poster with movie title, year and genre styling
export function getProceduralPosterSvg(title: string, year: string, genre: string, movieId: number): string {
  const color = GENRE_COLORS[genre] || DEFAULT_GENRE_COLOR;
  const clean = cleanMovieTitle(title).title;
  
  // Hash for subtle background variations
  const hash = Math.abs((movieId * 9301 + 49297) % 233280);
  const hue1 = (hash % 360);
  const hue2 = (hue1 + 45) % 360;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad_${movieId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${hue1}, 40%, 12%)" />
          <stop offset="50%" stop-color="#0B0E14" />
          <stop offset="100%" stop-color="hsl(${hue2}, 45%, 8%)" />
        </linearGradient>
        <linearGradient id="overlayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(0,0,0,0.2)" />
          <stop offset="50%" stop-color="rgba(0,0,0,0.5)" />
          <stop offset="100%" stop-color="rgba(8,11,16,0.95)" />
        </linearGradient>
        <radialGradient id="glow_${movieId}" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="hsl(${hue1}, 80%, 50%)" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#000" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Background -->
      <rect width="400" height="600" fill="url(#bgGrad_${movieId})" />
      <circle cx="200" cy="180" r="160" fill="url(#glow_${movieId})" />

      <!-- Cinematic Grid Accent -->
      <g opacity="0.08" stroke="#ffffff" stroke-width="1">
        <line x1="40" y1="40" x2="360" y2="40" />
        <line x1="40" y1="560" x2="360" y2="560" />
        <line x1="40" y1="40" x2="40" y2="560" />
        <line x1="360" y1="40" x2="360" y2="560" />
        <circle cx="200" cy="220" r="90" fill="none" />
      </g>

      <!-- Watermark Logo -->
      <text x="200" y="80" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="12" font-weight="700" letter-spacing="4">CINEMIND PREMIERE</text>
      
      <!-- Central Icon Aesthetic -->
      <circle cx="200" cy="220" r="44" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
      <polygon points="192,204 216,220 192,236" fill="hsl(${hue1}, 90%, 65%)" opacity="0.9" />

      <!-- Overlay gradient -->
      <rect width="400" height="600" fill="url(#overlayGrad)" />

      <!-- Typography -->
      <g transform="translate(30, 440)">
        <!-- Genre Pill -->
        <rect x="0" y="0" width="auto" height="22" rx="11" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />
        <text x="12" y="15" fill="#E2E8F0" font-family="Inter, sans-serif" font-size="11" font-weight="600" letter-spacing="1">${genre.toUpperCase()}</text>
        
        <!-- Year -->
        ${year ? `<text x="340" y="15" text-anchor="end" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="12" font-weight="600">${year}</text>` : ''}

        <!-- Title -->
        <text x="0" y="55" fill="#F8FAFC" font-family="Outfit, sans-serif" font-size="22" font-weight="700">
          ${clean.length > 22 ? clean.slice(0, 20) + '...' : clean}
        </text>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

// Main helper to get movie poster
export function getMoviePosterUrl(movie: { movie_id: number; title: string; genres?: string; tmdb_id?: number }): string {
  if (POSTER_CACHE[movie.movie_id]) {
    return POSTER_CACHE[movie.movie_id];
  }

  const { title, year } = cleanMovieTitle(movie.title);
  const firstGenre = movie.genres ? movie.genres.split('|')[0] : 'Drama';
  
  return getProceduralPosterSvg(title, year, firstGenre, movie.movie_id);
}

// Quality score stars helper (quality_score is on 0-5 scale)
export function getStarRating(qualityScore: number): number {
  if (!qualityScore) return 3.5;
  return Math.min(5, Math.max(1, Math.round(qualityScore * 10) / 10));
}

// Convert ML score (0-1) to percentage string
export function formatScorePercent(score?: number): string {
  if (score === undefined || score === null) return '85%';
  return `${Math.round(score * 100)}%`;
}

// Format runtime in minutes to "2h 22m" or "45m"
export function formatRuntime(runtimeMinutes?: number | null): string {
  if (!runtimeMinutes || runtimeMinutes <= 0) return '';
  const total = Math.round(runtimeMinutes);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

// Extract initials from name for avatar badge
export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Extract director name from crew list safely
export function getDirector(crewList?: Array<any> | null): string | null {
  if (!crewList || !Array.isArray(crewList) || crewList.length === 0) return null;
  for (const member of crewList) {
    if (typeof member === 'object' && member !== null) {
      if (member.job === 'Director' && member.name) {
        return member.name;
      }
    }
  }
  return null;
}

// Extract key crew list safely
export function getKeyCrewMembers(crewList?: Array<any> | null): Array<{ id?: number; name: string; job: string }> {
  if (!crewList || !Array.isArray(crewList) || crewList.length === 0) return [];
  const results: Array<{ id?: number; name: string; job: string }> = [];
  const seen = new Set<string>();

  const priorityJobs = ['Director', 'Writer', 'Screenplay', 'Producer', 'Original Music Composer', 'Director of Photography'];

  for (const member of crewList) {
    if (typeof member === 'object' && member !== null && member.name && member.job) {
      const key = `${member.name}_${member.job}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          id: member.id,
          name: member.name,
          job: member.job,
        });
      }
    } else if (typeof member === 'string' && member.trim()) {
      if (!seen.has(member)) {
        seen.add(member);
        results.push({ name: member, job: 'Crew' });
      }
    }
  }

  // Sort by priority jobs
  results.sort((a, b) => {
    const pA = priorityJobs.indexOf(a.job);
    const pB = priorityJobs.indexOf(b.job);
    if (pA !== -1 && pB !== -1) return pA - pB;
    if (pA !== -1) return -1;
    if (pB !== -1) return 1;
    return 0;
  });

  return results;
}

// Normalize cast list safely
export function getCastMembers(castList?: Array<any> | null): Array<{ id?: number; name: string; character: string; profile_path?: string | null }> {
  if (!castList || !Array.isArray(castList) || castList.length === 0) return [];
  const results: Array<{ id?: number; name: string; character: string; profile_path?: string | null }> = [];
  const seen = new Set<string>();

  for (const member of castList) {
    if (typeof member === 'object' && member !== null && member.name) {
      if (!seen.has(member.name)) {
        seen.add(member.name);
        results.push({
          id: member.id,
          name: member.name,
          character: member.character || 'Cast',
          profile_path: member.profile_path || null,
        });
      }
    } else if (typeof member === 'string' && member.trim()) {
      if (!seen.has(member)) {
        seen.add(member);
        results.push({
          name: member,
          character: 'Cast',
          profile_path: null,
        });
      }
    }
  }

  return results;
}
