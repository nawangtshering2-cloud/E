/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E8F0ED',
          100: '#D1E1DB',
          200: '#A3C3B7',
          300: '#75A593',
          400: '#47876F',
          500: '#1F4B3F',
          600: '#1A3F35',
          700: '#15332B',
          800: '#102721',
          900: '#0B1B17',
        },
        moss: {
          50: '#EEF4EF',
          100: '#DCE9DF',
          200: '#B9D3BF',
          300: '#96BD9F',
          400: '#73A77F',
          500: '#5A8F6B',
          600: '#4B7859',
          700: '#3C6147',
          800: '#2D4A35',
          900: '#1E3323',
        },
        'recycling-orange': {
          50: '#FBF3EB',
          100: '#F7E7D7',
          200: '#EFCFAF',
          300: '#E7B787',
          400: '#DF9F5F',
          500: '#C97B3C',
          600: '#A86532',
          700: '#874F28',
          800: '#66391E',
          900: '#452314',
        },
        mint: {
          50: '#F7FAF8',
          100: '#EAF2EC',
          200: '#D5E5D9',
          300: '#C0D8C6',
          400: '#ABCBB3',
          500: '#96BEA0',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'count-up': 'countUp 2s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #1F4B3F 0%, #2D6B55 50%, #5A8F6B 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1F4B3F 0%, #1A3F35 40%, #2D6B55 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(31,75,63,0.05) 0%, rgba(90,143,107,0.08) 100%)',
        'gradient-orange': 'linear-gradient(135deg, #C97B3C 0%, #DF9F5F 100%)',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(31, 75, 63, 0.08)',
        'card-hover': '0 8px 30px rgba(31, 75, 63, 0.15)',
        'navbar': '0 2px 20px rgba(31, 75, 63, 0.1)',
        'button': '0 4px 14px rgba(31, 75, 63, 0.25)',
        'button-hover': '0 6px 20px rgba(31, 75, 63, 0.35)',
        'glow': '0 0 30px rgba(90, 143, 107, 0.3)',
      },
    },
  },
  plugins: [],
};
