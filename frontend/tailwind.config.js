/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7C3AED',
          pink: '#FF4FA3',
          yellow: '#FFD43B',
          blue: '#38BDF8',
          mint: '#34D399',
          orange: '#FF8A3D',
          indigo: '#28245C',
          lavender: '#F3E8FF',
          darkBg: '#181438',
          cardDark: '#201A4C'
        }
      },
      fontFamily: {
        bubble: ['Fredoka', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
        code: ['Fira Code', 'monospace']
      },
      backgroundImage: {
        'grad-purple-pink': 'linear-gradient(135deg, #7C3AED 0%, #FF4FA3 100%)',
        'grad-blue-purple': 'linear-gradient(135deg, #38BDF8 0%, #7C3AED 100%)',
        'grad-orange-yellow': 'linear-gradient(135deg, #FF8A3D 0%, #FFD43B 100%)',
        'grad-pink-orange': 'linear-gradient(135deg, #FF4FA3 0%, #FF8A3D 100%)',
        'grad-mint-blue': 'linear-gradient(135deg, #34D399 0%, #38BDF8 100%)',
        'grad-cyber': 'linear-gradient(135deg, #28245C 0%, #7C3AED 50%, #FF4FA3 100%)',
        'kids-mesh': 'radial-gradient(circle at 15% 15%, rgba(124, 58, 237, 0.15) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(255, 79, 163, 0.15) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1) 0%, transparent 60%)'
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(124, 58, 237, 0.5)',
        'glow-pink': '0 0 25px -5px rgba(255, 79, 163, 0.5)',
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.5)',
        'glow-orange': '0 0 25px -5px rgba(255, 138, 61, 0.5)',
        'glow-yellow': '0 0 25px -5px rgba(255, 212, 59, 0.5)',
        'fun': '0 10px 0 0 rgba(0, 0, 0, 0.15)'
      },
      animation: {
        'bounce-soft': 'bounceSoft 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-6%)' },
          '50%': { transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
