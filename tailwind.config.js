/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#584afe',
        },
        secondary: {
          DEFAULT: '#feac51',
        }
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'sans-serif'],
      }
    },
  },
  plugins: [require('tailwind-scrollbar'), require('@tailwindcss/typography')],
}

