/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          foreground: '#ffffff',
          dark: '#2563eb',
        },
        background: {
          DEFAULT: '#f8fafc',
          dark: '#0f172a',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e293b',
        },
        text: {
          DEFAULT: '#0f172a',
          dark: '#f8fafc',
          muted: '#64748b',
          mutedDark: '#94a3b8'
        }
      },
    },
  },
  plugins: [],
}
