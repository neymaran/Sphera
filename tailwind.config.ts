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
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e3a8a",
          900: "#1e3464",
          950: "#0f172a",
        },
        surface: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
        },
      },
      boxShadow: {
        "soft-sm":  "0 2px 8px 0 rgba(30,58,138,0.06)",
        "soft":     "0 4px 16px 0 rgba(30,58,138,0.08)",
        "soft-md":  "0 8px 24px 0 rgba(30,58,138,0.10)",
        "soft-lg":  "0 16px 48px 0 rgba(30,58,138,0.14)",
        "soft-xl":  "0 24px 64px 0 rgba(30,58,138,0.18)",
        "glow":     "0 0 24px rgba(37,99,235,0.3)",
        "glow-lg":  "0 0 48px rgba(37,99,235,0.2)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
        "gradient-surface": "linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)",
        "gradient-card":    "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(239,246,255,0.7) 100%)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      keyframes: {
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "sphere-spin": {
          "0%":   { transform: "rotate(0deg) translateX(20px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(20px) rotate(-360deg)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "shimmer":         "shimmer 2s linear infinite",
        "float":           "float 3s ease-in-out infinite",
        "pulse-ring":      "pulse-ring 1.5s ease-out infinite",
        "sphere-spin":     "sphere-spin 3s linear infinite",
        "fade-up":         "fade-up 0.5s ease-out",
        "slide-in-right":  "slide-in-right 0.4s ease-out",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
