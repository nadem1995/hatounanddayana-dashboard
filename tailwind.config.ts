import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  plugins: [require("tailwindcss-rtl")],
  // Enable RTL support
  theme: {
    extend: {
      colors: {
        golden: {
          50: "#fdf8f2",
          100: "#f7eddf",
          200: "#eedcc0",
          300: "#e3c89e",
          400: "#d8b48c",
          500: "#ff0000",
          600: "#b08a60",
          700: "#8f6d47",
          800: "#6e5236",
          900: "#4e3a26",
          950: "#2e2114",
        },
      },
    },
  },
};
