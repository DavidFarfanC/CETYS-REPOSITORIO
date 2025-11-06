const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cetys: {
          yellow: '#FFC600',
          black: '#1D1D1B',
          gray: '#F4F4F4'
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"SF Pro Display"', 'Poppins', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glass: '0 20px 40px rgba(0, 0, 0, 0.08)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
