export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nested',
    tailwindcss: {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
  },
}
