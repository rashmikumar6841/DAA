/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    {
      pattern: /(text|bg|border)-(cyan|amber|violet|rose)(-dim)?/,
    },
    {
      pattern: /(text|bg|border)-(cyan|amber|violet|rose)\/(10|15|20|30)/,
    },
    "shadow-glow",
    "shadow-glowAmber",
    "shadow-glowViolet",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0A0C0F",
        panel: "#12151A",
        panel2: "#171B21",
        line: "#242A33",
        line2: "#1A1F26",
        cyan: {
          DEFAULT: "#6FE7DD",
          dim: "#3E8F89",
        },
        amber: {
          DEFAULT: "#F2A65A",
          dim: "#8A6337",
        },
        violet: {
          DEFAULT: "#9B8CFF",
          dim: "#5B5290",
        },
        rose: {
          DEFAULT: "#F27A7A",
          dim: "#8A4A4A",
        },
        ink: {
          DEFAULT: "#E7E9EC",
          dim: "#8B93A1",
          faint: "#525860",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(to right, #1A1F26 1px, transparent 1px), linear-gradient(to bottom, #1A1F26 1px, transparent 1px)",
        scan: "repeating-linear-gradient(180deg, rgba(111,231,221,0.035) 0px, rgba(111,231,221,0.035) 1px, transparent 1px, transparent 3px)",
      },
      boxShadow: {
        glow: "0 0 24px rgba(111,231,221,0.25)",
        glowAmber: "0 0 24px rgba(242,166,90,0.25)",
        glowViolet: "0 0 24px rgba(155,140,255,0.25)",
      },
      keyframes: {
        pulse2: {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.4 },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        pulse2: "pulse2 1.6s ease-in-out infinite",
        scanline: "scanline 3s linear infinite",
      },
    },
  },
  plugins: [],
};
