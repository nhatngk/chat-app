/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "form": "rgba(0, 0, 0, 0.24) 0px 3px 8px"
      }
    },
    colors: {
      "white": "#fff",
      'disable': '#6B7280',
      'blue': '#0075e9',
      'red': '#EB0014',
      'slate': '#F8FAFC',
      'ocean':'#0f1ddf'
    },
  },
  plugins: [],
}