/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#0F172A',
        'secondary-bg': '#1A1F3A',
        'card-bg': '#1F2937',
        'primary-accent': '#3B82F6',
        'secondary-accent': '#A855F7',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'text-primary': '#F9FAFB',
        'text-secondary': '#D1D5DB',
        'text-tertiary': '#9CA3AF',
        'border': '#374151',
        'surface': '#111827'
      }
    },
  },
  plugins: [],
}
