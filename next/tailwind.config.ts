import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#122C4E',
        teal: '#1C8C86',
        sand: '#ECE5D6',
        coral: '#E0705C',
        ink: '#1B1F26',
      },
      fontFamily: { sans: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
