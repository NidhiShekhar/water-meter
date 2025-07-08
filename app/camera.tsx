// app/camera.tsx
import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import CameraView, { CameraRefType } from '../components/CameraView';
import CapturedImageView from '../components/CapturedImageView';
import useCameraPermission from '../hooks/useCameraPermission';

export default function CameraScreen() {
  const { hasPermission, isLoading, requestPermission } = useCameraPermission();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraRefType>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleCapture = (uri: string) => {
    setCapturedImage(uri);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleAccept = () => {
    // Here you would process the image
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Camera permission denied</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <CameraView
          ref={cameraRef}
          onCapture={handleCapture}
          onClose={() => router.back()}
        />
      ) : (
        <CapturedImageView
          imageUri={capturedImage}
          onRetake={handleRetake}
          onAccept={handleAccept}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});