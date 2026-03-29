import { useCallback, useMemo } from 'react';

type VibratePattern = number | readonly number[];

const PATTERNS = {
  input: 10,
  error: [100, 50, 100],
  success: [50, 30, 100],
} as const;

function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function doVibrate(pattern: VibratePattern): void {
  if (!canVibrate() || prefersReducedMotion()) return;
  try {
    navigator.vibrate(pattern as number | number[]);
  } catch {
    // ignore
  }
}

export function useHapticFeedback() {
  const isSupported = useMemo(() => canVibrate(), []);
  const vibrate = useCallback((pattern: VibratePattern) => doVibrate(pattern), []);
  const vibrateInput = useCallback(() => doVibrate(PATTERNS.input), []);
  const vibrateError = useCallback(() => doVibrate(PATTERNS.error), []);
  const vibrateSuccess = useCallback(() => doVibrate(PATTERNS.success), []);

  return { isSupported, vibrate, vibrateInput, vibrateError, vibrateSuccess };
}
