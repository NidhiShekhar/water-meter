// app/camera.tsx
import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import CameraView, { CameraRefType } from '../components/CameraView';
import CapturedImageView from '../components/CapturedImageView';
import useCameraPermission from '../hooks/useCameraPermission';
import useMediaLibraryPermission from '../hooks/useMediaLibraryPermission';

export default function CameraScreen() {
  const { hasPermission: hasCameraPermission, isLoading: cameraLoading, requestPermission: requestCameraPermission } = useCameraPermission();
  const { hasPermission: hasMediaPermission, isLoading: mediaLoading, requestPermission: requestMediaPermission } = useMediaLibraryPermission();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraRefType>(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleCapture = (uri: string) => {
    setCapturedImage(uri);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleAccept = async () => {
    if (!capturedImage) return;

    // Check and request media library permission if needed
    if (!hasMediaPermission) {
      await requestMediaPermission();
      if (!hasMediaPermission) {
        Alert.alert(
          "Permission Required",
          "To save images, you need to grant permission to access your photo library."
        );
        return;
      }
    }

    try {
      setIsSaving(true);

      // First create an asset from the captured image
      const asset = await MediaLibrary.createAssetAsync(capturedImage);

      // Then try to find the album
      const albumName = 'water-meter';
      let album = await MediaLibrary.getAlbumAsync(albumName);

      if (album) {
        // If album exists, add the asset to it
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        // If album doesn't exist, create it with the asset
        await MediaLibrary.createAlbumAsync(albumName, asset, false);
      }

      Alert.alert(
        "Success",
        "Image saved to water-meter folder in your gallery",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save the image to your gallery");
    } finally {
      setIsSaving(false);
    }
  };

  // Rest of the component remains the same...
  if (cameraLoading || mediaLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (hasCameraPermission === false) {
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
          isSaving={isSaving}
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