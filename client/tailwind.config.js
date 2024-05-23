/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

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
      'black': '#000',
      'blur': '#f1f1f1',
      'blue': '#0866ff',
      'red': '#EB0014',
      'slate': '#F8FAFC',
      'ocean':'#0f1ddf'
    },
  },
  plugins: [
    plugin(function({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.2xl') },
        'h2': { fontSize: theme('fontSize.xl') },
        'h3': { fontSize: theme('fontSize.lg') },
      })
    })
  ],
}