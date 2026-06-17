import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#fafaf9",
        surface: "#ffffff",
        text: "#171717",
        textMuted: "#0e0e0e",
        textSubtle: "#2a2929",
        primary: "#8dacff",
        primarySoft: "#1e293b",
        accent: "#0f766e",
        accentSoft: "#ccfbf1",
        border: "#e5e5e5",
        borderStrong: "#d4d4d4"
      },
      maxWidth: {
        app: "1100px"
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        mdsoft: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)"
      }
    }
  },
  plugins: []
};

export default config;
