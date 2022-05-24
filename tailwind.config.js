module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      colors: {
        green: "#128C7E",
        greenlight: "#D7F8F4",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
