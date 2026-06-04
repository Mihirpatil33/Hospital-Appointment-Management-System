/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        brand: {
          50:  '#edfcf4',
          100: '#d3f7e4',
          200: '#aaeece',
          300: '#72e0b2',
          400: '#38c98e',
          500: '#17ae74',
          600: '#0d8c5c',
          700: '#0c704c',
          800: '#0d5a3e',
          900: '#0c4a34',
        },
        slate: {
          850: '#172033',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
