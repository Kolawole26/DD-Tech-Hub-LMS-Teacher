// tailwind.config.js (in your project root)
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          primary: '#a70103',
          'primary-light': '#f59d9a',
          'primary-lighter': '#fde7e6',
          'primary-dark': '#610401',
        },
        status: {
          green: '#10b981', // green-500
          red: '#ef4444',   // red-500
        }
      },
    },
  },
  plugins: [],
}