export interface BrandColors {
  /** HSL values without hsl() wrapper, e.g. "215 80% 52%" */
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface BrandConfig {
  /** Unique tenant identifier */
  tenantId: string;
  /** Display name of the app */
  appName: string;
  /** Short subtitle shown below the name */
  appSubtitle: string;
  /** URL for the logo image (square, at least 192px) */
  logoUrl: string | null;
  /** URL for PWA icon 192x192 */
  pwaIcon192: string | null;
  /** URL for PWA icon 512x512 */
  pwaIcon512: string | null;
  /** Favicon URL */
  faviconUrl: string | null;
  /** Light mode color overrides (only override what changes) */
  colors: Partial<BrandColors>;
  /** Dark mode color overrides */
  darkColors: Partial<BrandColors>;
  /** Contact phone displayed in support sections */
  supportPhone: string;
  /** Copyright text */
  copyright: string;
}
