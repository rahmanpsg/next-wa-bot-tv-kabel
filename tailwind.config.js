module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      keyframes: {
        backInOutRight: {
          "0%": {
            transform: "translateX(500px) scale(0.7)",
            opacity: 0.7,
          },
          "20%": {
            transform: "translateX(0px) scale(0.7)",
            opacity: 0.7,
          },
          "30%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "75%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "85%": {
            transform: "translateX(0px) scale(0.7)",
            opacity: 0.7,
          },
          "100%": {
            transform: "translateX(2000px) scale(0.7)",
            opacity: 0.7,
            visibility: "hidden",
          },
        },
        backOutRight: {
          "0%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "20%": {
            transform: "translateX(0px) scale(0.7)",
            opacity: 0.7,
          },
          "50%": {
            transform: "translateX(2000px) scale(0.7)",
            opacity: 0.7,
          },
        },
      },
      animation: {
        backInOutRight: "backInOutRight 4s ease-in-out",
        backOutRight: "backOutRight 1s ease-in-out",
      },
    },
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
