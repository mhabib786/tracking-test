module.exports = {
  content: [
    "./app/views/**/*.html.erb",
    "./app/helpers/**/*.rb",
    "./app/assets/stylesheets/**/*.css",
    "./app/javascript/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Mono"', 'monospace'], // Replace the default sans font with DM Mono
      },
      borderImageSource: {
        "gradient-to-left-bottom":
          "linear-gradient(to left, rgba(212, 18, 18, 0.6) 0%, rgba(229, 235, 245, 0.06) 100%)",
      },
      zIndex: {
        60: "60",
        70: "70",
      },
    },
  },

  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        ".gradient-border-left": {
          borderLeftWidth: "1px",
          borderImageSource: theme("borderImageSource.gradient-to-left-bottom"),
          borderImageSlice: 1,
        },
        ".gradient-border-bottom": {
          borderBottomWidth: '1px', 
          borderImageSource: 'linear-gradient(to right, rgba(0, 0, 255, 1) 0%, rgba(255, 0, 255, 1) 100%)',
          borderImageSlice: 1,
        },
        ".no-spinner": {
          appearance: "textfield",
          "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: "0",
          },
        },
      });
    },
  ],
};
