/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      // Your existing extend configurations
    },
    fontSize: {
      xs: ['11px', '1rem'],
      sm: ['13px', '1.25rem'], // Decreased from default 14px
      base: ['15px', '1.5rem'], // Decreased from default 16px
      lg: ['17px', '1.75rem'], // Decreased from default 18px
      xl: ['19px', '1.75rem'], // Decreased from default 20px
      '2xl': ['23px', '2rem'], // Decreased from default 24px
      '3xl': ['29px', '2.25rem'],
      '4xl': ['35px', '2.5rem'],
      '5xl': ['47px', '1'],
      '6xl': ['59px', '1'],
      '7xl': ['71px', '1'],
      '8xl': ['95px', '1'],
      '9xl': ['127px', '1'],
      'context-menu': ['13px', '1.10rem'], // New size for context menu
    }
  },
  plugins: [],
} 