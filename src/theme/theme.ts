/**
 * QRcode — Unified Theme
 * ------------------------
 * Aggregates color / typography / spacing / radius / shadow tokens into a
 * single theme object. Supports dark, light and system preferences.
 *
 * Usage:
 *   import { theme } from "./theme/theme";
 *   theme.colors.brand[500];        // #00C896
 *   theme.mode.dark.surface;        // #101722
 */

import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { shadows } from "./shadows";

export type ThemeMode = "dark" | "light" | "system";

export const theme = {
  name: "QRcode",
  colors,
  typography,
  spacing,
  radius,
  shadows,
  /** Semantic dark/light token groups (background, surface, text…). */
  mode: {
    dark: colors.dark,
    light: colors.light,
  },
} as const;

/** Maps resolved UI theme to the semantic token group. */
export function getThemeTokens(mode: Exclude<ThemeMode, "system">) {
  return mode === "dark" ? colors.dark : colors.light;
}

export default theme;