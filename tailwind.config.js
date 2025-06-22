/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        blush: '#ffe4e6',
        rose: '#f43f5e',
        lilac: '#c4b5fd',
      },
    },
  },
  plugins: [],
}

