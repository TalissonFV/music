/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1db954',
          'green-hover': '#1ed760',
          dark: '#121212',
          surface: '#181818',
          card: '#282828',
          'card-hover': '#3e3e3e',
          subtext: '#a7a7a7',
          border: '#2a2a2a'
        }
      }
    },
  },
  plugins: [],
}
