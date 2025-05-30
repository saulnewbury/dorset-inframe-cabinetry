/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{html,js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,jsx,ts,tsx,json}'
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        lightGrey: 'hsl(220, 3%, 90%)',
        darkGrey: 'hsl(220, 3%, 50%)',
        blue: 'hsl(223, 19%, 47%)',
        darkBlue: 'hsl(223, 19%, 40%)',
        blueTint: 'hsl(223, 10%, 94%)',
        lightBlue: 'hsl(220, 29%, 94%)',
        overlay: 'hsla(0, 0%, 20%, .6)',
        red: 'hsl(0, 100%, 50%)'
      }
    }
  },
  plugins: []
}
