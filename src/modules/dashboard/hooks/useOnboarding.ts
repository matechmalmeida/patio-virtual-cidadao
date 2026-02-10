import { useState, useCallback } from 'react';

const ONBOARDING_KEY = 'pv_onboarding_completed';

export function useOnboarding() {
  const [isOpen, setIsOpen] = useState(() => {
    return !localStorage.getItem(ONBOARDING_KEY);
  });

  const complete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setIsOpen(true);
  }, []);

  return { isOpen, complete, reset };
}
