/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables toggling dark mode via class
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        sunset: '#FF4C00',
        lime: '#00FF66',
        sky: '#00CFFF',
        gold: '#FFD700',
        // Neutrals
        charcoal: '#1A1A1A',
        slate: '#2E2A25',
        ash: '#EFEFEB',
        sand: '#CAC0A3',
        // Accents
        crimson: '#D72638',
        electric: '#1B9AAA',
        // Backgrounds
        background: {
          light: '#EFEFEB', // Ash White
          dark: '#1A1A1A',  // Charcoal Black
          cardLight: '#FFFFFF',
          cardDark: '#2E2A25',
          secondaryLight: '#CAC0A3', // Sand Beige
          secondaryDark: '#2E2A25',  // Slate Gray
        },
        // Text
        text: {
          light: '#2E2A25', // Slate Gray
          dark: '#CAC0A3',  // Sand Beige
          headingLight: '#1A1A1A', // Charcoal Black
          headingDark: '#EFEFEB', // Ash White
        },
        // Buttons
        button: {
          primaryLight: '#FF4C00', // Sunset Orange
          primaryDark: '#FF4C00',
          secondaryLight: 'transparent',
          secondaryDark: 'transparent',
        },
        // Links
        link: {
          light: '#00CFFF', // Sky Blue
          dark: '#FFD700', // Golden Yellow
        },
        // Icons
        icon: {
          light: '#00FF66', // Lime Green
          dark: '#1B9AAA', // Electric Blue
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
