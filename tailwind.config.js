/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#d62926",
          secondary: "#ed5038",
          accent: "#8ceadc",
          neutral: "#28232e",
          "base-100": "#293a47",
          info: "#6e8ecf",
          success: "#27b480",
          warning: "#fbd96a",
          error: "#f24076",
          body: {
            "background-color": "e3e6e6",
          },
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
