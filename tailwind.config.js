/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        pink: {
          500: "#ec4899",
          600: "#db2777",
        },
      },
      spacing: {
        128: "32rem",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
