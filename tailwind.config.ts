import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        biruBiasa:"#DBEAFE",
        biruLangit:"#EFF6FF",
        kuningBiasa:"#FEF3C7",
        kuningMuda :"#FFFBEB",
        hijauDaun :"#D1FAE5",
        hijauMuda:"#ECFDF5",
      },
    },
  },
  plugins: [],
};
export default config;
