/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080B10",
        surface: {
          DEFAULT: "#0F141F",
          50: "#1A2234",
          100: "#141B29",
          200: "#0F141F",
          300: "#0B0E17",
        },
        card: {
          DEFAULT: "#131926",
          hover: "#1B2335",
          border: "rgba(255, 255, 255, 0.08)",
          highlight: "rgba(99, 102, 241, 0.15)",
        },
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        accent: {
          violet: "#8B5CF6",
          purple: "#A855F7",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-brand': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 15px 0 rgba(99, 102, 241, 0.1)',
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.4)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.4)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%': { opacity: '0.4', transform: 'scale(0.98)' },
          '100%': { opacity: '0.8', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
