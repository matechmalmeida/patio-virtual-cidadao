import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { setFingerprint as setGlobalFingerprint } from '../store/fingerprint-store';

const STORAGE_KEY_DEVICE_ID = 'pv-cidadao-device-id';
const STORAGE_KEY_FINGERPRINT = 'pv-cidadao-fingerprint';

interface FingerprintContextValue {
  fingerprint: string | null;
  deviceId: string | null;
  isNewDevice: boolean;
  isLoading: boolean;
  setDeviceInfo: (deviceId: string, isNewDevice: boolean) => void;
  clearDeviceInfo: () => void;
}

const FingerprintContext = createContext<FingerprintContextValue | null>(null);

function getStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function removeStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function FingerprintProvider({ children }: { children: ReactNode }) {
  const [fingerprint, setFingerprint] = useState<string | null>(() => getStored(STORAGE_KEY_FINGERPRINT));
  const [deviceId, setDeviceId] = useState<string | null>(() => getStored(STORAGE_KEY_DEVICE_ID));
  const [isNewDevice, setIsNewDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(() => !getStored(STORAGE_KEY_FINGERPRINT));

  useEffect(() => {
    const cached = getStored(STORAGE_KEY_FINGERPRINT);
    if (cached) {
      setGlobalFingerprint(cached);
    }

    let cancelled = false;
    const TIMEOUT_MS = 3000;

    const timeoutId = setTimeout(() => {
      if (!cancelled) setIsLoading(false);
    }, TIMEOUT_MS);

    const load = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        if (!cancelled) {
          if (!cached) {
            setFingerprint(result.visitorId);
            setGlobalFingerprint(result.visitorId);
            setStored(STORAGE_KEY_FINGERPRINT, result.visitorId);
          }
        }
      } catch {
        if (!cancelled && !cached) {
          setFingerprint(null);
          setGlobalFingerprint(null);
        }
      } finally {
        if (!cancelled) {
          clearTimeout(timeoutId);
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const setDeviceInfo = useCallback((newDeviceId: string, newIsNewDevice: boolean) => {
    setDeviceId(newDeviceId);
    setIsNewDevice(newIsNewDevice);
    setStored(STORAGE_KEY_DEVICE_ID, newDeviceId);
  }, []);

  const clearDeviceInfo = useCallback(() => {
    setDeviceId(null);
    setIsNewDevice(false);
    removeStored(STORAGE_KEY_DEVICE_ID);
  }, []);

  return (
    <FingerprintContext.Provider
      value={{ fingerprint, deviceId, isNewDevice, isLoading, setDeviceInfo, clearDeviceInfo }}
    >
      {children}
    </FingerprintContext.Provider>
  );
}

export function useFingerprint() {
  const ctx = useContext(FingerprintContext);
  if (!ctx) {
    throw new Error('useFingerprint must be used within FingerprintProvider');
  }
  return ctx;
}
