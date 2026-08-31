/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['Fredoka', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#3FB58E',
          yellow: '#F5B316',
          blue: '#3B82F6',
          orange: '#EF7B54',
          dark: '#384C6B'
        },
        primary: {
          DEFAULT: '#3FB58E', // updated to match brand green
          foreground: '#ffffff',
          dark: '#2d8969',
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#0f172a',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e293b',
        },
        text: {
          DEFAULT: '#384C6B', // using brand dark
          dark: '#f8fafc',
          muted: '#64748b',
          mutedDark: '#94a3b8'
        }
      },
    },
  },
  plugins: [],
}
