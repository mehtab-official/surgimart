import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
        lora: ['var(--font-lora)', 'serif'],
      },
      colors: {
        brand: { DEFAULT: '#2563EB', light: '#EFF6FF', dark: '#1D4ED8' },
        teal: { DEFAULT: '#0D9488', light: '#F0FDFA' },
      },
      animation: {
        float: 'floating 3s ease-in-out infinite',
      },
      keyframes: {
        floating: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
