/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        background: "#F9FAFB",
        darkBackground: "#0F172A",
        foreground: "#FFFFFF",
        darkForeground: "#1E293B",
        text: "#111827",
        darkText: "#F1F5F9",
        secondaryText: "#6B7280",
        darkSecondaryText: "#94A3B8",
        border: "#E5E7EB",
        darkBorder: "#334155",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  darkMode: 'media',
  plugins: [],
}
