/**
 * QRcode — Typography System
 * ----------------------------
 * High-contrast, professional SaaS typography.
 */

export const fonts = {
  sans: [
    "-apple-system",
    "BlinkMacSystemFont",
    "'Segoe UI'",
    "'Inter'",
    "'Roboto'",
    "'Oxygen'",
    "'Ubuntu'",
    "'Cantarell'",
    "'Fira Sans'",
    "'Droid Sans'",
    "'Helvetica Neue'",
    "sans-serif",
  ].join(", "),
  mono: [
    "source-code-pro",
    "Menlo",
    "Monaco",
    "Consolas",
    "'Courier New'",
    "monospace",
  ].join(", "),
} as const;

export const fontSize = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const lineHeight = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const typography = { fonts, fontSize, fontWeight, lineHeight } as const;

export default typography;