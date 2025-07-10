/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        spotify: {
          green: '#1DB954',
          greenHover: '#1ed760',
          black: '#191414',
          dark: '#121212',
          gray: '#282828',
          lightGray: '#B3B3B3',
          white: '#FFFFFF',
          red: '#E91429',
          blue: '#1E75D8',
          purple: '#8D67AB',
          orange: '#E8115B',
          yellow: '#FFD700',
        },
        background: {
          primary: '#121212',
          secondary: '#181818',
          tertiary: '#282828',
          quaternary: '#404040',
          elevated: '#282828',
          card: '#181818',
          sidebar: '#000000',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          tertiary: '#727272',
          muted: '#A7A7A7',
          disabled: '#535353',
        },
        border: {
          primary: '#282828',
          secondary: '#404040',
          accent: '#1DB954',
        },
        hover: {
          primary: '#282828',
          secondary: '#404040',
          green: '#1ed760',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spotify-hover': 'spotifyHover 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        spotifyHover: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
      },
      boxShadow: {
        'spotify': '0 8px 16px rgba(0, 0, 0, 0.3)',
        'spotify-hover': '0 12px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
} 