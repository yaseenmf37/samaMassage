/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-vazir)", "Vazirmatn", "sans-serif"],
      },
      colors: {
        // پالت اسپای گرم و آرامش‌بخش
        cream: "#f7f4ee",
        sand: "#efe8dc",
        forest: {
          50: "#eef5f1",
          100: "#d6e7dd",
          200: "#aecfbc",
          300: "#7fb096",
          400: "#4f8f70",
          500: "#2f7357",
          600: "#215a44",
          700: "#1c4a39",
          800: "#173b2e",
          900: "#122e24",
        },
        gold: {
          light: "#e2c894",
          DEFAULT: "#c8a45c",
          dark: "#a8863f",
        },
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(28, 74, 57, 0.25)",
        card: "0 8px 30px -10px rgba(28, 74, 57, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "hero-fade":
          "linear-gradient(to top, rgba(18,46,36,0.85) 0%, rgba(18,46,36,0.35) 45%, rgba(18,46,36,0.15) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
