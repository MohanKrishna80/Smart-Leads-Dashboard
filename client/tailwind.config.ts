import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        brand: "#126C66",
        coral: "#E15B4F",
        gold: "#E8AA32"
      },
      boxShadow: {
        panel: "0 16px 50px rgba(23, 32, 51, 0.12)"
      }
    }
  },
  plugins: []
} satisfies Config;
