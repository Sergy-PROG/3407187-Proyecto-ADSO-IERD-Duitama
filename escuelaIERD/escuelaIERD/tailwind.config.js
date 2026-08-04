/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        club: {
          green: '#1B5E20',
          'green-light': '#2E7D32',
          'green-50': '#E8F5E9',
          'green-100': '#C8E6C9',
          red: '#C62828',
          'red-light': '#E53935',
          'red-50': '#FFEBEE',
          'red-100': '#FFCDD2',
          orange: '#4B5563',
          'orange-light': '#6B7280',
          'orange-50': '#F3F4F6',
          dark: '#2D2D2D',
          'dark-2': '#1A1A1A',
          'dark-3': '#111111',
          gray: '#4A4A4A',
          amber: '#F59E0B',
          'amber-50': '#FFFBEB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}