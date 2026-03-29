const STORAGE_KEY = 'pv-cidadao-fingerprint';

let currentFingerprint: string | null = null;

export function setFingerprint(fingerprint: string | null): void {
  currentFingerprint = fingerprint;
}

export function getFingerprint(): string | null {
  if (currentFingerprint) return currentFingerprint;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
