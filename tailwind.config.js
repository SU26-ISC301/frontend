/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        shopee: {
          DEFAULT: '#FF4D2E',
          hover: '#E63E20',
          light: '#FFF1ED',
        },
        brand: {
          primary: '#FF4D2E',
          secondary: '#FF2D6D',
          accent: '#00C9A7',
          dark: '#0B1220',
          darker: '#060A12',
          surface: '#F8F7F4',
          muted: '#64748B',
        },
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(11, 18, 32, 0.08)',
        elevated: '0 20px 50px -20px rgba(11, 18, 32, 0.18)',
        glow: '0 8px 32px -8px rgba(255, 77, 46, 0.45)',
        'glow-pink': '0 8px 32px -8px rgba(255, 45, 109, 0.35)',
      },
      backgroundImage: {
        'gradient-brand':
          'linear-gradient(135deg, #FF4D2E 0%, #FF2D6D 55%, #FF6B35 100%)',
        'gradient-dark':
          'linear-gradient(135deg, #0B1220 0%, #1a2744 50%, #0B1220 100%)',
        'gradient-seller':
          'linear-gradient(160deg, #0B1220 0%, #1e3a5f 40%, #0f172a 100%)',
        'mesh-light':
          'radial-gradient(at 0% 0%, rgba(255,77,46,0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255,45,109,0.1) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(0,201,167,0.08) 0px, transparent 50%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
