/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2d5be3',
        primaryLight: '#e3edfa',
        primaryDark: '#2046a8',
        secondary: '#f7f8fa',
        secondaryLight: '#ffffff',
        secondaryDark: '#e5e7eb',
        textMain: '#181a1b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        md: '0.5rem',
        lg: '1rem',
      },
    },
  },
  plugins: [],
};
