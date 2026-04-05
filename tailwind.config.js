/** @type {import('tailwindcss').Config} */
const { Colors } = require('./src/shared/constants/Colors');
module.exports = {
  // Add './app/**/*.{js,ts,tsx}' to the list below
  content: [
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './App.{js,ts,tsx}',
  ],
  
  presets: [require('nativewind/preset')],
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: Colors.dark.primary,
        background: Colors.dark.background,
        surface: Colors.dark.surface,
        surfaceLight: Colors.dark.surfaceLight,
        muted: Colors.dark.textMuted,
        dim: Colors.dark.textDim,
        urgent: Colors.dark.error,
        background: Colors.background,
        surface: Colors.surface,
       // primary: Colors.primary,
        secondary: Colors.secondary,
        text: Colors.text,
        'text-secondary': Colors.textSecondary,
        success: Colors.success,
        warning: Colors.warning,
        error: Colors.error,
        border: Colors.border,
        card: Colors.card,
        brdBorder: '#3a3c3d'
      },
      // Add a Scale for Spinners/Icons if needed
      spacing: {
        '18': '72px',
      },
      surface: {
  secondary: '#111118',
  border:    '#2a2a3a',
},
brand: {
  400: '#8470ff',
  700: '#2a1e5a',
  900: '#1a1030',
},
text: {
  primary: '#f0f0ff',
  muted:   '#606078',
},
    },
  },
};