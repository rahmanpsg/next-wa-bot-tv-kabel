module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#96CEB4",

          secondary: "#FFEEAD",

          accent: "#3cb4bc",

          neutral: "#1E202F",

          "base-100": "#fff",

          info: "#30B7D9",

          success: "#1A7F4E",

          warning: "#FFAD60",

          error: "#D9534F",
        },
      },
    ],
  },
};
