const SESSION_KEY = 'pv-cidadao-session';
const REMEMBER_KEY = 'pv-cidadao-remember';

export function setRememberMe(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    window.localStorage.setItem(REMEMBER_KEY, 'true');
  } else {
    window.localStorage.removeItem(REMEMBER_KEY);
  }
}

export function getRememberMe(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(REMEMBER_KEY) === 'true';
}

export function getStorage(): Storage {
  const remember = window.localStorage.getItem(REMEMBER_KEY);
  return remember === 'true' ? window.localStorage : window.sessionStorage;
}

export function hasActiveSession(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.localStorage.getItem(SESSION_KEY) === 'true' ||
    window.sessionStorage.getItem(SESSION_KEY) === 'true'
  );
}

export function setActiveSession(): void {
  if (typeof window === 'undefined') return;
  const storage = getStorage();
  storage.setItem(SESSION_KEY, 'true');
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}
