/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
                DEFAULT: '#7132f5',
                dark: '#5741d8',
                deep: '#5b1ecf',
                subtle: 'rgba(133, 91, 251, 0.16)',
              },
        'near-black': '#101114',
        'cool-gray': '#686b82',
        'silver-blue': '#9497a9',
        'border-gray': '#dedee5',
        success: '#149e61',
        'success-dark': '#026b3f',
      },
      fontFamily: {
        display: ['IBM Plex Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['IBM Plex Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '12px',
        '3xl': '16px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.03)',
        'card-purple': '0 4px 24px rgba(113, 50, 245, 0.12)',
        'float': 'rgba(0, 0, 0, 0.03) 0px 4px 24px',
      },
    },
  },
  plugins: [],
}