/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        nye: {
          bg: '#0a0a1a',
          surface: '#12122a',
          'surface-light': '#1a1a38',
          gold: '#d4af37',
          'gold-light': '#f5e6a8',
          'gold-dark': '#a8861e',
          red: '#e63946',
          'red-dark': '#c1121f',
          green: '#2a9d8f',
          blue: '#3b82f6',
          frost: '#a0c4ff',
        },
      },
      spacing: {
        safe: 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
