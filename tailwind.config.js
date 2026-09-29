/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#060913',
          darker: '#03050a',
          surface: '#0d1527',
          surfaceLight: '#14213d',
          border: '#1f2e4d',
          cyan: '#00f0ff',
          neonPurple: '#a855f7',
          neonGreen: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          textMuted: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Roboto Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -2px rgba(0, 240, 255, 0.45)',
        'glow-purple': '0 0 20px -2px rgba(168, 85, 247, 0.45)',
        'glow-green': '0 0 20px -2px rgba(16, 185, 129, 0.45)',
        'glow-danger': '0 0 25px 0px rgba(239, 68, 68, 0.65)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'laser-flow': 'laserFlow 1.5s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.8))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px rgba(0, 240, 255, 0.2))' },
        },
        laserFlow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
