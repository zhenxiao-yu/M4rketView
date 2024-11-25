/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { nunito: "Nunito" },
    },

    colors: {
      gray: { 100: "#5B8FB9", 200: "#301E67", 300: "#03001C" },
      white: "#fdfdfb",
      cyan: "#B6EADA",
      red: "#e72179",
      green: "#1ec471",
    },
    fontSize: {
      sm: "14px",
      md: "18px",
      lg: "24px",
      xl: "32px",
      base: "16px",
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
