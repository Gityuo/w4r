/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15, 23, 42, 0.25)'
      },
      colors: {
        glass: {
          panel: 'rgba(255,255,255,0.14)',
          edge: 'rgba(255,255,255,0.2)'
        }
      },
      borderRadius: {
        card: '14px'
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  plugins: []
};
