/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "weather-primary": "#0068A",
        "weather-secondary": "#004E71",
        "Sfondo": "#abbedf"
      },
      fontFamily: {
        Roboto: ["Roboto, sans-serif"]
      },
      container: {
        padding: "2rem",
        center: "true"
      },
      screens: {
        sm: "640px",
        md: "768px",
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1530px",
        "3xl": "3000px",
        "4xl": "4000px",
        mobile: { max: "1279px" },
        "mobile-xs": { max: "670px" },
        desktop: "1280px"
      }
    },
  },
  plugins: [],
}

