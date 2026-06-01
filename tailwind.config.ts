/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F6B3F",
          light: "#1a8f55",
          dark: "#0a4e2d",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#e8c84a",
          dark: "#b8922a",
        },
        dark: "#0A1628",
      },
      fontFamily: {
        arabic: ["Tajawal", "Noto Naskh Arabic", "sans-serif"],
        calligraphy: ["Scheherazade New", "serif"],
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(-5px) rotate(-1deg)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(212, 175, 55, 0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
