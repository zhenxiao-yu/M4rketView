/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        // Brand palette preserved as extensions (not replacements)
        // Old class names still work: cyan, red, green
        cyan: '#B6EADA',
        red: '#e72179',
        green: '#1ec471',
        gray: {
          100: '#5B8FB9',
          200: '#301E67',
          300: '#03001C',
        },
        white: '#fdfdfb',
        // New brand namespace for shadcn/ui compatibility
        brand: {
          cyan: '#B6EADA',
          pink: '#e72179',
          green: '#1ec471',
          navy: {
            100: '#5B8FB9',
            200: '#301E67',
            300: '#03001C',
          },
        },
      },
      fontSize: {
        sm: '14px',
        base: '16px',
        md: '18px',
        lg: '24px',
        xl: '32px',
      },
      backdropBlur: {
        glass: '10px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow-cyan': '0 0 20px rgba(182, 234, 218, 0.4)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #03001C 0%, #301E67 100%)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
