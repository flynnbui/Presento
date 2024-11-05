export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Add the file extensions you’re using
  ],
  theme: {
    extend: {
      backgroundSize: {
        '200%': '200%'
      },
      keyframes: {
        gradientShift: {
          '0%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          },
          '100%': {
            backgroundPosition: '0% 50%'
          }
        }
      },
      animation: {
        gradientShift: 'gradientShift 6s ease infinite'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
  		colors: {}
    }
  },
  plugins: [require("tailwindcss-animate")],
};