/** @type {import('tailwindcss').Config} */

/**
 * QRcode — Tailwind theme
 * Centralized brand tokens (mirrors src/theme/colors.ts).
 * Dark mode is enabled via the `dark` class on <html> (see App.js).
 */

const colors = {
  brand: {
    50: "#DDFBF3",
    100: "#C8F7EB",
    200: "#8AEDD6",
    300: "#33D6AE",
    400: "#00C896",
    500: "#00C896",
    600: "#00A878",
    700: "#008A64",
    800: "#066B4A",
    900: "#064E3B",
  },
  tech: {
    50: "#E8F1FF",
    100: "#D6E8FF",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
  },
  premium: {
    50: "#F0EBFF",
    400: "#A78BFA",
    500: "#8B5CF6",
    600: "#7C3AED",
  },
  marketing: {
    50: "#FFF5D9",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
  },
  surface: {
    300: "#1C2634", // subtle border
    400: "#263244", // border
    500: "#0D141F", // input background
    600: "#1B2635", // elevated surface
    700: "#151E2B", // secondary surface
    800: "#101722", // primary surface / card
    900: "#0A0F18", // alternative background
    950: "#070B12", // page background
  },
};

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors,
      boxShadow: {
        "brand-glow":
          "0 0 0 1px rgba(0,200,150,0.25), 0 8px 30px rgba(0,200,150,0.25)",
        "brand-glow-sm":
          "0 0 0 1px rgba(0,200,150,0.20), 0 4px 16px rgba(0,200,150,0.18)",
      },
    },
  },
  plugins: [],
};


