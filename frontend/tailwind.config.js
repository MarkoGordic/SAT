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
        "grey": "#525364",
        "blue": "#2C57F3"
      },
      height: {
        "screen-dhv": "100dvh"
      }
    },
  },
  plugins: [],
}