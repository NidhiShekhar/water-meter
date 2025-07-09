// hooks/useMediaLibraryPermission.ts
import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

export default function useMediaLibraryPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const requestPermission = async () => {
    setIsLoading(true);
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    setIsLoading(false);
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return { hasPermission, isLoading, requestPermission };
}