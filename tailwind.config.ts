import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          black: '#0B0B0B',
          offwhite: '#F6F5F2',
        },
        accent: {
          blue: '#2E7DF6',
        },
      },
      fontFamily: {
        // Will rely on system fonts; swap to next/font when assets decided
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
