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
        lofi: {
          bg: "#0B0813",
          card: "#141026",
          cardHover: "#1C1736",
          cardAlt: "#18132F",
          border: "#28204A",
          borderHover: "#4A3B7E",
          pink: "#F43F5E",
          neonPink: "#FF2A85",
          purple: "#9333EA",
          lavender: "#A855F7",
          blue: "#3B82F6",
          cyan: "#06B6D4",
          amber: "#F59E0B",
          muted: "#948FB8",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "lofi-glow": "radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.25) 0%, rgba(11, 8, 19, 0) 70%)",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "spin-vinyl": "spin 4s linear infinite",
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
