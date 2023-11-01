import type { Config } from "tailwindcss";
import { Poppins } from "next/font/google";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Source Serif 4", "serif"],
        poppins: [`${Poppins}`, "sans-serif"]
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        retro: {
          ...require("daisyui/src/theming/themes")["[data-theme=retro]"],
          "base-100": "#f6f4ec",
          "base-200": "#EDE9D9",
          "base-300": "#E4DEC8",
          primary: "#545748",
          ".btn-primary": {
            color: "#f6f4ec",
          },
        },
      },
    ],
  },
};
export default config;
