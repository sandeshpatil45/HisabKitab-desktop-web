/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        background: '#F5F7FA',
        card: '#FFFFFF',
        text: '#1F2937',
        error: '#EF4444',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
}
