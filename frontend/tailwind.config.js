/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#95051F", // Rojo fuerte
          dark: "#870518",
          soft: "#875260", // Rojo púrpura suave
        },
        neutral: {
          900: "#202129", // Negro grisáceo
          300: "#D6D4D4", // Gris medio (tablas)
          100: "#E7E1E0", // Gris claro (fondos)
          200: "#A59DA6", // Gris púrpura
        },
      },

      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.05)",
      },

      borderRadius: {
        card: "12px",
      },
    },
  },

  plugins: [],
};
