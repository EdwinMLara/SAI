/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Color de texto secundario más claro que textMain
        textSecondary: '#6b7280', // gray-500

        textMain: '#181a1b',

        primary: '#2d5be3',
        primaryLight: '#e3edfa',
        primaryDark: '#2046a8',
        secondary: '#f7f8fa',
        secondaryLight: '#ffffff',
        secondaryDark: '#e5e7eb',

        'dark-textSecondary': '#9ca3af', // gray-400
        bg: '#f7f8fa',
        card: '#ffffff',

        'dark-primary': '#4169e1',
        'dark-primaryLight': '#2a3f5f',
        'dark-primaryDark': '#1a2035',
        'dark-secondary': '#1f2937',
        'dark-secondaryLight': '#374151',
        'dark-secondaryDark': '#111827',
        'dark-textMain': '#f9fafb',
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '2rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
