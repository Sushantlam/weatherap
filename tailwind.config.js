

/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'green-85bc22': '#85bc22',
        'dark-bg': '#222b3c',
       
      },
      colors: {
        'blue-primary': '#A0E9FF',
      },

      
      
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    
  ],
}
