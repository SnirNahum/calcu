/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'c-orange': '#F97316',
        'c-amber': '#FBBF24',
        'c-display': '#0F172A',
        'c-panel': '#1E293B',
        'c-btn': '#334155',
        'c-btn-hover': '#475569',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}
