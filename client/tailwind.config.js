/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          black: "#000",
          white: "#FFF",
          gray: "#6D6D6D",
        },
        secondary: {
          white: "#EEE",
          black: "#222",
          gray: "#282828",
        },
        tertiary: {},
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans"],
        "montserrat-black": ["var(--font-montserrat-black)", "sans"],
        "montserrat-bold": ["var(--font-montserrat-bold)", "sans"],
        "montserrat-extra-bold": ["var(--font-montserrat-extra-bold)", "sans"],
        "montserrat-extra-light": ["var(--font-montserrat-extra-light)", "sans"],
        "montserrat-italic": ["var(--font-montserrat-italic)", "sans"],
        "montserrat-semi-bold": ["var(--font-montserrat-semi-bold)", "sans"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  darkMode: "class",
}
