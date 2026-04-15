/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1d4ed8",
          subtle: "#eff6ff",
        },

        accent: {
          DEFAULT: "#ec4899",
          dark: "#db2777",
        },

        surface: {
          DEFAULT: "#ffffff",
          muted: "#f9fafb",
          subtle: "#f3f4f6",
        },

        text: {
          primary: "#111827",
          secondary: "#4b5563",
          subtle: "#9ca3af",
        },
        status: {
          success: "#16a34a",
          error: "#dc2626",
          warning: "#f59e0b",
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#d1d5db",
        },
      },

      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },

      boxShadow: {
        card: "0 4px 10px rgba(0,0,0,0.06)",
        cardHover: "0 10px 20px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
