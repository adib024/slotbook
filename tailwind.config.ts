import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        primary: "#111111",
        secondary: "#666666",
        muted: "#888888",
        border: "#E0E0E0",
        surface: "#FAFAFA",
        "slot-booked": "#F0F0F0",
      },
    },
  },
  plugins: [],
};
export default config;
