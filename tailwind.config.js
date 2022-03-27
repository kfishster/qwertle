module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: 'media',
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
        },
        fade: {
          '0%': { 'background-color': 'rgb(255 255 255 / 0.25)' },
          '100%': { 'background-color': 'rgb(255 255 255 / 0)' }
        },
      },
      animation: {
        'cursor': 'pulse 1s linear infinite',
        'wiggle': 'wiggle 200ms ease-in-out',
        'fade': 'fade 150ms ease-in-out'
      },
      boxShadow: {
        'glow1': 'inset 0px 0px 14px 6px rgb(0 0 0 / 0.25)',
        'glow2': 'inset 0px 0px 8px 3px rgb(0 0 0 / 0.25)',
        'glow3': 'inset 0px 0px 10px -2px rgb(0 0 0 / 0.25)'
      },
      width: {
        '9/10': '90%'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
