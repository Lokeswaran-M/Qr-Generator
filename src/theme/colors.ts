/**
 * QRcode — Centralized Color System
 * ------------------------------------
 * Brand: electric emerald/teal. Supports: tech (blue), premium (violet),
 * marketing (orange). Dark mode is the primary premium experience.
 *
 * Usage: import { colors } from "./colors" — never hardcode raw hex values
 * in components.
 */

export const brand = {
  50: "#DDFBF3", // primary soft
  100: "#C8F7EB",
  200: "#8AEDD6",
  300: "#33D6AE", // primary light
  400: "#00C896", // primary
  500: "#00C896", // primary (anchor)
  600: "#00A878", // primary dark
  700: "#008A64",
  800: "#066B4A",
  900: "#064E3B",
} as const;

export const tech = {
  50: "#E8F1FF", // blue soft
  400: "#60A5FA", // blue light
  500: "#3B82F6", // blue
  600: "#2563EB", // blue dark
} as const;

export const premium = {
  50: "#F0EBFF", // violet soft
  400: "#A78BFA", // violet light
  500: "#8B5CF6", // violet
  600: "#7C3AED", // violet dark
} as const;

export const marketing = {
  50: "#FFF5D9", // orange soft
  400: "#FBBF24", // orange light
  500: "#F59E0B", // orange
  600: "#D97706", // orange dark
} as const;

export const success = {
  medium: "#00C896",
  strong: "#16A34A",
} as const;

export const error = {
  DEFAULT: "#EF4444",
  dark: "#DC2626",
  soft: "#FEECEC",
} as const;

export const warning = {
  DEFAULT: "#F59E0B",
  soft: "#FFF7E6",
} as const;

/** Dark mode surfaces (primary premium experience). */
export const dark = {
  background: "#070B12", // page background
  backgroundAlt: "#0A0F18", // alternative background
  surface: "#101722", // primary surface / card
  surfaceAlt: "#151E2B", // secondary surface
  elevated: "#1B2635", // elevated surface
  input: "#0D141F", // input background
  border: "#263244", // border
  borderSubtle: "#1C2634", // subtle border
  text: "#F8FAFC", // primary text
  textSecondary: "#A7B1C2", // secondary text
  textMuted: "#6B778C", // muted text
  textDisabled: "#465164", // disabled text
} as const;

/** Light mode — clean premium light surfaces. */
export const light = {
  background: "#F6F8FB",
  primary: "#FFFFFF",
  secondary: "#F9FAFB",
  elevated: "#FFFFFF",
  border: "#E4E8EF",
  borderSubtle: "#F0F2F5",
  text: "#111827",
  textSecondary: "#667085",
  textMuted: "#98A2B3",
  textDisabled: "#D0D5DD",
  input: "#F8FAFC",
} as const;

export const colors = {
  brand,
  tech,
  premium,
  marketing,
  success,
  error,
  warning,
  dark,
  light,
} as const;

export default colors;