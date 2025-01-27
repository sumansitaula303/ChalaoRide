module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins-Regular"],
        "sans-light": ["Poppins-Light"],
        "sans-medium": ["Poppins-Medium"],
        "sans-semibold": ["Poppins-SemiBold"],
        "sans-bold": ["Poppins-Bold"],
      },
      colors: {
        primary: {
          DEFAULT: "#FF6100",
          100: "#FFF1E6",
          200: "#FFD0B5",
          300: "#FFAE83",
          400: "#FF8D52",
          500: "#FF6100",
          600: "#CC4E00",
          700: "#993B00",
          800: "#662800",
          900: "#331400",
        },
        secondary: {
          DEFAULT: "#1552CC",
          100: "#E6F0FF",
          200: "#B3D1FF",
          300: "#80B3FF",
          400: "#4D94FF",
          500: "#1552CC",
          600: "#1141A3",
          700: "#0D317A",
          800: "#082052",
          900: "#041029",
        },
      },
    },
  },
  plugins: [],
};
