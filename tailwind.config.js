/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e50914',
        "primary-dark": '#b91c1c',
        dark: '#111111',
      },
    },
  },
  plugins: [],
}

