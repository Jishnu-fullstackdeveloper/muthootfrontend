/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
  theme: {
    extend: {
      fontSize: {
        base: '14px' // Set base font size to 14px (standard size)
      },
      maxHeight: {
        menu: 'calc(100vh - 64px)' // Example: Limit menu height, adjust 64px based on header height
      }
    }
  }
}
