// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.html",   
    "./components/**/*.html",   
    "./src/**/*.js",   
    "./assets/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ED7B01',
        darkblue: '#1C236B'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}