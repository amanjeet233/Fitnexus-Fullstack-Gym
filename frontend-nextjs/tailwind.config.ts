import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional color scheme
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Main primary
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        neo: {
          50: "#e6f1ff",
          100: "#b3d9ff",
          200: "#80c1ff",
          300: "#4da9ff",
          400: "#1a91ff",
          500: "#0073e6", // Main neo blue
          600: "#005bb3",
          700: "#004380",
          800: "#002b4d",
          900: "#00131a",
        },
        accent: {
          50: "#e6f1ff",
          100: "#b3d9ff",
          200: "#80c1ff",
          300: "#4da9ff",
          400: "#1a91ff",
          500: "#0073e6",
          600: "#005bb3",
          700: "#004380",
          800: "#002b4d",
          900: "#00131a",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "neo-glow": "neoGlow 2s ease-in-out infinite",
        "neo-pulse": "neoPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        neoGlow: {
          "0%, 100%": { 
            boxShadow: "0 0 5px rgba(0, 115, 230, 0.5), 0 0 10px rgba(0, 115, 230, 0.3), 0 0 15px rgba(0, 115, 230, 0.2)",
          },
          "50%": { 
            boxShadow: "0 0 10px rgba(0, 115, 230, 0.8), 0 0 20px rgba(0, 115, 230, 0.6), 0 0 30px rgba(0, 115, 230, 0.4)",
          },
        },
        neoPulse: {
          "0%, 100%": { 
            boxShadow: "0 0 5px rgba(0, 115, 230, 0.5), 0 0 10px rgba(0, 115, 230, 0.3)",
          },
          "50%": { 
            boxShadow: "0 0 15px rgba(0, 115, 230, 1), 0 0 25px rgba(0, 115, 230, 0.8), 0 0 35px rgba(0, 115, 230, 0.6)",
          },
        },
      },
      boxShadow: {
        "neo-sm": "0 0 5px rgba(0, 115, 230, 0.5), 0 0 10px rgba(0, 115, 230, 0.3)",
        "neo-md": "0 0 10px rgba(0, 115, 230, 0.6), 0 0 20px rgba(0, 115, 230, 0.4), 0 0 30px rgba(0, 115, 230, 0.2)",
        "neo-lg": "0 0 15px rgba(0, 115, 230, 0.8), 0 0 30px rgba(0, 115, 230, 0.6), 0 0 45px rgba(0, 115, 230, 0.4)",
        "neo-xl": "0 0 20px rgba(0, 115, 230, 1), 0 0 40px rgba(0, 115, 230, 0.8), 0 0 60px rgba(0, 115, 230, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;

