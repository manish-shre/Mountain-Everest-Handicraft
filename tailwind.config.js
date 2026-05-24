/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A227',
        'gold-light': '#E5D4A1',
        'gold-dark': '#A68521',
        silver: '#A8A9AD',
        'silver-light': '#E8E8EA',
        navy: '#1B2838',
        'navy-light': '#2C3E50',
        cream: '#F8F6F1',
        'cream-dark': '#EDE9E0',
      },
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'serif'],
        sans: ['"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(27, 40, 56, 0.08)',
        'soft-lg': '0 8px 40px rgba(27, 40, 56, 0.12)',
        'gold': '0 4px 20px rgba(201, 162, 39, 0.2)',
      },
    },
  },
  plugins: [],
}
