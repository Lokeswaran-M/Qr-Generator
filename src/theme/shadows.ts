/**
 * QRcode — Shadow System
 * ------------------------
 * Subtle, elevated SaaS shadows. Avoid heavy shadows.
 */

export const shadows = {
  sm: "0 1px 2px 0 rgba(16, 24, 40, 0.06)",
  DEFAULT: "0 1px 3px 0 rgba(16, 24, 40, 0.10), 0 1px 2px -1px rgba(16, 24, 40, 0.06)",
  md: "0 4px 6px -1px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.05)",
  lg: "0 12px 16px -4px rgba(16, 24, 40, 0.10), 0 4px 6px -4px rgba(16, 24, 40, 0.05)",
  xl: "0 24px 32px -8px rgba(16, 24, 40, 0.12), 0 8px 12px -6px rgba(16, 24, 40, 0.06)",
  // Brand glow for primary actions / selected states
  brand: "0 0 0 1px rgba(0, 200, 150, 0.25), 0 8px 30px rgba(0, 200, 150, 0.25)",
  brandSm: "0 0 0 1px rgba(0, 200, 150, 0.20), 0 4px 16px rgba(0, 200, 150, 0.18)",
} as const;

export default shadows;