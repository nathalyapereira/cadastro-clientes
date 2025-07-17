// tailwind.config.js
const PrimeUI = require("tailwindcss-primeui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // ✅ arquivos que o VS Code deve indexar
  ],
  theme: {
    extend: {},
  },
  plugins: [PrimeUI],
};
