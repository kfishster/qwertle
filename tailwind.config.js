module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minHeight: {
      '2/5': '40%',
    },
    maxHeight: {
      '3/4': '75%'
    },
    extend: {
      colors: {
        'mainframe-green': '#41FF00',
        'mainframe-dark': '#282828',
        'mainframe-yellow': '#FFB000'
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.05' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' }
        }
      },
      animation: {
        'cursor': 'pulse 1s linear infinite',
        'wiggle': 'wiggle 200ms ease-in-out'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
