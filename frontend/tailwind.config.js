/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "black": "#0A0A0C",
        "light-black": "#21222D",
        "grey": "#525364",
        "light-grey": "#A6A6A6",
        "blue": "#2C57F3",
        "dark-blue": "#2046C1",
        "red": "#8A1A1B",
        "green": "#3AD365"
      },
      height: {
        "screen-dhv": "100dvh"
      }
    },
  },
  plugins: [],
}