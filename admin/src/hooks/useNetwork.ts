import { useState, useEffect } from 'react';

export function useNetwork() {
  const [isOnline, setNetwork] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateNetwork = () => {
      setNetwork(window.navigator.onLine);
    };

    window.addEventListener('offline', updateNetwork);
    window.addEventListener('online', updateNetwork);

    return () => {
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('online', updateNetwork);
    };
  });

  return isOnline;
}
