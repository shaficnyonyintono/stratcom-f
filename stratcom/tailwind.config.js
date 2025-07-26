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
        primary: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        secondary: {
          light: '#f8fafc',
          dark: '#1e293b',
        },
      },
    },
  },
  plugins: [],
}
