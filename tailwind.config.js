/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit", // فعال کردن JIT Mode
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazir", "sans-serif"],
      },
    },
    plugins: [],
  },
};
