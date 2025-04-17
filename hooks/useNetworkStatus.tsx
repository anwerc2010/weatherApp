// src/hooks/useNetworkStatus.ts

import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected && !!state.isInternetReachable);
    });

    // Fetch initial state
    NetInfo.fetch().then(state => {
      setIsConnected(!!state.isConnected && !!state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
};
