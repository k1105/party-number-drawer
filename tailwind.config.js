/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "base-blue": "#2e3192",
        "base-green": "#006837",
        "accent-red": "#ff0000",
      },
    },
  },
  plugins: [],
};
