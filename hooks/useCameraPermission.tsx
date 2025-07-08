import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Camera } from 'expo-camera';

export default function useCameraPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async () => {
    setIsLoading(true);
    if (Platform.OS === 'web') {
      console.log('Web platform detected, requesting camera access.');
      try {
        setHasPermission(true);
      } catch (error) {
        setHasPermission(false);
        Alert.alert('Permission required', 'Camera permission is needed to scan.');
      }
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed to scan.');
      }
    }
    setIsLoading(false);
  };

  return { hasPermission, isLoading, requestPermission };
}