/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { 'hand': ['Patrick Hand', 'cursive'], 'sans': ['Patrick Hand', 'cursive'] },
      colors: {
        primary: { 50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F' },
        neo: { yellow: '#FFD43B', pink: '#FF006E', blue: '#3A86FF', green: '#06D6A0', orange: '#FF6B35', purple: '#8338EC', black: '#1A1A1A', bg: '#FFFDF7' }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #1A1A1A',
        'neo-sm': '2px 2px 0px 0px #1A1A1A',
        'neo-lg': '6px 6px 0px 0px #1A1A1A',
        'neo-hover': '6px 6px 0px 0px #1A1A1A',
        'neo-yellow': '4px 4px 0px 0px #FFD43B',
        'neo-pink': '4px 4px 0px 0px #FF006E',
        'neo-blue': '4px 4px 0px 0px #3A86FF',
        'neo-green': '4px 4px 0px 0px #06D6A0',
        'neo-orange': '4px 4px 0px 0px #FF6B35',
        'neo-purple': '4px 4px 0px 0px #8338EC',
      },
      keyframes: {
        'float': { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        'wiggle': { '0%, 100%': { transform: 'rotate(0deg)' }, '25%': { transform: 'rotate(-3deg)' }, '75%': { transform: 'rotate(3deg)' } },
        'pulse-glow': { '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 212, 59, 0.4)' }, '50%': { boxShadow: '0 0 0 12px rgba(255, 212, 59, 0)' } },
        'slide-up': { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-up': 'slide-up 0.5s ease-out',
      }
    }
  },
  plugins: []
}
