/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx,ts,jsx,js}"],
  theme: {
    extend: {
      colors: {
        primarygrey: "#ECECEC",
        primarylight: "#0000000D",
        textgrey: "#4D4D4D",
        textlightgrey: "#000000B2",
        textblack: "#000000D9",
        linkblue: "#348BDC",
        errorred: "#e9033a",
        iconorange: "#E9AE56",
        icongray: "#00000080",
        lightorange: "#FFBE5C",
        redinput: "#FF003D",
        golden: "#BD8E4B",
        sucgreen: "#32BA7626",
        sugreentext: "#2D8B5D",
        negred: "#FF003D26",
        negredtext: "#BD0935",
        stgray: "#556575",
        stgraybg: "#6B849926",
        modalbg: "#0000004D",
        ongoing: "#BD5C0A",
        done: "#30AA6E",
        bgblue: "#3697F14D",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(to right, #844DBB, #6E4299)",
      },
      screens: {
        "xs-max": { max: "380px" },
        "phone-max": { max: "680px" },
      },
      fontSize: {
        tr: "13px",
        ft: "15px",
        st: "17px",
      },
    },
  },
  plugins: [],
};
