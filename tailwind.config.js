/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      // --- ADICIONE AS LINHAS ABAIXO ---
      keyframes: {
        'toast-in': {
          '0%': { transform: 'translateY(-100%) translateX(-50%)', opacity: '0' },
          '100%': { transform: 'translateY(0) translateX(-50%)', opacity: '1' },
        },
        'modal-in': {
          '0%': { transform: 'scale(0.95) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'toast-in': 'toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'modal-in': 'modal-in 0.3s ease-out forwards',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
      // --------------------------------
    },
  },
  plugins: [],
}