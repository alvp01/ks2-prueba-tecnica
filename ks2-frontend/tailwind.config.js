/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8f7',
          100: '#dcefeb',
          200: '#baddd5',
          300: '#8fc6bb',
          400: '#63ab9d',
          500: '#478d80',
          600: '#397267',
          700: '#315c54',
          800: '#2c4a45',
          900: '#273f3b'
        },
        coral: {
          100: '#ffe5dc',
          300: '#ffb7a1',
          500: '#f68463',
          700: '#d45f42'
        }
      },
      fontFamily: {
        display: ['Poppins', 'Segoe UI', 'sans-serif'],
        body: ['Manrope', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        panel: '0 16px 50px -24px rgba(25, 47, 43, 0.45)'
      }
    }
  },
  plugins: []
};
