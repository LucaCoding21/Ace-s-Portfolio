import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0a0a0a",
          light: "#141414",
          lighter: "#1a1a1a",
        },
        secondary: "#888888",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
