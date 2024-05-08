/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,php}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    fontFamily: {
      "brand-display": ["'Tilt Neon'", "Arial", "Helvetica", "sans-serif"],
      "brand-body": ["'PT Sans'", "sans-serif", "system-ui"]
    },
    colors: {
      //inspiration:
      //https://dribbble.com/shots/17266165-Dev-Agency-Website-Design-Dark-theme

      //tool and resources
      //https://colorffy.com/dark-theme-generator
      //https://tailwindcss.com/docs/customizing-colors

      "bg-lighter": "#f3f4f6",
      "bg-light": "#e5e7eb",
      "surface-light-100": "#9ca3af",
      "surface-light-200": "#a7adb8",
      "surface-light-300": "#b1b7c0",

      "bg-darker": "#0B0B0B",
      "bg-dark": "#171717",
      "brand-primary-100": "#fba58f",
      "brand-primary-200": "#ef765b",
      "brand-primary-300": "#e03f2a",
      "brand-primary-500-neutral": "#D61010",
      "brand-primary-600": "#ab0d0d",
      "brand-primary-700": "#800a0a",
      "brand-primary-800": "#6b0808",
      "brand-secondary": "#161F45",
      "surface-dark-100": "#232323",
      "surface-dark-200": "#3a3a3a",
      "surface-dark-300": "#535353",

      "info-complementary": "#0b9696"
    },
    extend: {}
  },
  content: ["./**/*.php", "./**/*.html", "./**/*.css", "./**/*.js"],
  safelist: [
    "bg-lighter",
    "bg-light",
    "surface-light-100",
    "surface-light-200",
    "surface-light-300",
    "bg-darker",
    "bg-dark",
    "brand-primary-100",
    "brand-primary-200",
    "brand-primary-300",
    "brand-primary-500-neutral",
    "brand-primary-600",
    "brand-primary-700",
    "brand-primary-800",
    "brand-secondary",
    "surface-dark-100",
    "surface-dark-200",
    "surface-dark-300",
    "info-complementary"
  ],
  plugins: [require("tailwindcss-animated")]
};
