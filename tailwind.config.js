/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexora: {
          dark: '#080B14',
          secondary: '#101626',
          sidebar: '#0D1320',
          card: '#151E30',
          cardHover: '#1B263D',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(121, 103, 255, 0.3)',
          purple: '#7967FF',
          blue: '#38BDF8',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          text: '#F8FAFC',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        '3d': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(121, 103, 255, 0.06)',
        'glow-purple': '0 0 25px -5px rgba(121, 103, 255, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

