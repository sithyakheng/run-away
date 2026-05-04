/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#1a1a2e',
        border: '#2a2a3e',
        primary: '#8b5cf6',
        secondary: '#ec4899',
        text: '#ffffff',
        'text-secondary': '#9ca3af',
      }
    },
  },
  plugins: [],
}
