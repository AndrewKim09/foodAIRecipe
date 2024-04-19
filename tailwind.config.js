/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        lg: '40px',
        md: '28px',
        sm: '20px',
        regular: '16px'
      },
      colors: {
        darkcharcoal: '#312E2C',
        darkraspberry: '#7A284E',
        brandyred: '#854632',
        wengebrown: '#5F564D',
        eggshell: '#F3E5D7',
        whitecoffee: '#E3DDD7',
        snow: '#FFF7FB'
      }
    },
  },
  plugins: [],
}