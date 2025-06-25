/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",       // Next.js pages
    "./components/**/*.{js,ts,jsx,tsx}",  // Your components
    "./app/**/*.{js,ts,jsx,tsx}",         // Optional: if you're using /app directory
    "./src/**/*.{js,ts,jsx,tsx}",         // Optional: if using /src directory
    "./index.html",                       // For Vite/React (if using)
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f19",
        foreground: "#ffffff",
        accent: "#39ff14",
      },
      fontFamily: {
        mono: ["'Share Tech Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
