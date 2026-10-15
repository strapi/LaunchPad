import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B2545', 700: '#13335C', 900: '#071A33' },
        teal: { DEFAULT: '#0F7C78', 600: '#0C6966', 100: '#DDF0ED', 50: '#EFF8F6' },
        sand: { DEFAULT: '#F4EFE6', 200: '#E9E1D2' },
        amber: '#E8B86B',
        coral: '#D9674F',
        ink: { DEFAULT: '#14202E', 600: '#44505E', 400: '#7A8694' },
        line: '#E4E7EB',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,37,69,0.05), 0 8px 24px -12px rgba(11,37,69,0.18)',
        lift: '0 2px 4px rgba(11,37,69,0.06), 0 20px 40px -16px rgba(11,37,69,0.28)',
      },
      borderRadius: { xl2: '1.25rem' },
      maxWidth: { wrap: '76rem' },
    },
  },
  plugins: [],
};
export default config;
