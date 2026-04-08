export const Colors = {
  dark: {
    // Core
    background:   '#0F0F1A',
    surface:      '#161626',
    surfaceLight: '#1F1F33',

    // Brand
    primary:      '#6C63FF',   // purple
    primaryDim:   '#2A1E5A',   // purple border/bg
    primaryFaint: '#1A1030',   // purple ghost bg

    // Accent
    secondary:    '#00D2D3',   // cyan
    accent:       '#FF9F43',   // orange
    textBlue:     '#3B82F6',   // blue for links and highlights

    // Status
    error:        '#FF4B4B',
    success:      '#27AE60',
    warning:      '#FF9F43',

    // Text
    textPrimary:  '#FFFFFF',
    textMuted:    '#94A3B8',
    textDim:      '#64748B',

    // Borders
    border:       '#2A2A3A',
    borderFaint:  '#1A1A24',

    //text
    text: '#FFFFFF',
  },
  spacing: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
  },
  radius: {
    sm:  8,
    md:  12,
    lg:  16,
    xl:  24,
    full: 9999,
  },
} as const;