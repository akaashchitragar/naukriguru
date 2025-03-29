/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary blue colors
        "primary-blue": "#0A2463", // Deep blue - primary color
        "secondary-blue": "#1E5F8C", // Medium blue - secondary color
        "light-blue": "#3D9BE9", // Light blue - accent color
        
        // Primary yellow colors
        "primary-yellow": "#FFCB05", // Bright yellow - primary accent
        "secondary-yellow": "#FFE566", // Light yellow - secondary accent
        "dark-yellow": "#E6B800", // Darker yellow - for hover states
        
        // Supporting colors
        "pure-white": "#FFFFFF",
        "off-white": "#F8F9FA",
        "light-gray": "#E9ECEF",
        "medium-gray": "#6C757D",
        "dark-gray": "#343A40",
        "pure-black": "#000000",
        
        // Legacy colors (keeping for backward compatibility)
        "deep-blue": "#0A2463", // Updated to match new primary-blue
        "accent-orange": "#FFCB05", // Updated to match new primary-yellow
        "soft-purple": "#3D9BE9", // Updated to match new light-blue
        
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "scan": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(80px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": "fadeIn 0.5s ease-out",
        "scan": "scan 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 