import { useState, useEffect, useCallback } from 'react';

export interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission | 'default';
  isRequesting: boolean;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    isRequesting: false,
  });

  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setState((prev) => ({
      ...prev,
      isSupported: supported,
      permission: supported ? Notification.permission : 'default',
    }));
  }, []);

  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false;

    setState((prev) => ({ ...prev, isRequesting: true }));

    try {
      const result = await Notification.requestPermission();
      setState((prev) => ({
        ...prev,
        permission: result,
        isRequesting: false,
      }));
      return result === 'granted';
    } catch {
      setState((prev) => ({ ...prev, isRequesting: false }));
      return false;
    }
  }, [state.isSupported]);

  const sendLocalNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!state.isSupported || Notification.permission !== 'granted') return;

      try {
        new Notification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          ...options,
        });
      } catch {
        // Fallback for mobile — use service worker
        navigator.serviceWorker?.ready.then((reg) => {
          reg.showNotification(title, {
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            ...options,
          });
        });
      }
    },
    [state.isSupported]
  );

  return {
    ...state,
    requestPermission,
    sendLocalNotification,
  };
}
