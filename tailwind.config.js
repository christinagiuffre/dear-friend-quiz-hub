/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        purple: '#8848d8',
        blue: '#41a0e4',
        pink: '#f2a3d0',
        lavender: '#ebe4f8',
        cream: '#fff6ec',
        mist: '#F4F4F4',
        ink: '#2c2440',
        muted: '#6b6480',
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['"Open Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.75rem',
        app: '2rem',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 8px 28px -8px rgba(136, 72, 216, 0.18)',
        lift: '0 16px 40px -12px rgba(136, 72, 216, 0.28)',
        card: '0 4px 24px -4px rgba(136, 72, 216, 0.12), 0 1px 0 rgba(255,255,255,0.8) inset',
        glow: '0 8px 32px -8px rgba(65, 160, 228, 0.35)',
        inset: 'inset 0 1px 3px rgba(136, 72, 216, 0.08)',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.75' },
        },
      },
      animation: {
        floatUp: 'floatUp 450ms ease-out both',
        float: 'float 5s ease-in-out infinite',
        pulseSoft: 'pulseSoft 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
