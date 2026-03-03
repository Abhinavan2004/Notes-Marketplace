/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        foreground: '#e4e4e7',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}

