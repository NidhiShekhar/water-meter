// app/camera.tsx
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import CameraView, { CameraRefType } from '../components/CameraView';
import CapturedImageView from '../components/CapturedImageView';
import useCameraPermission from '../hooks/useCameraPermission';
import useMediaLibraryPermission from '../hooks/useMediaLibraryPermission';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen() {
  const { hasPermission: hasCameraPermission, isLoading: cameraLoading, requestPermission: requestCameraPermission } = useCameraPermission();
  const { hasPermission: hasMediaPermission, isLoading: mediaLoading, requestPermission: requestMediaPermission } = useMediaLibraryPermission();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraRefType>(null);
  const { meterID } = useLocalSearchParams();

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

      // Associate photo with specific water meter in AsyncStorage
      if (meterID) {
        const meterPhotosKey = `meter-photos-${meterID}`;
        const storedPhotos = await AsyncStorage.getItem(meterPhotosKey);
        const photos = storedPhotos ? JSON.parse(storedPhotos) : [];

        // Correct the URI to ensure it points to the water-meter subfolder
        let photoUri = asset.uri;
        if (!photoUri.includes('/water-meter/')) {
          // Extract the filename from the URI
          const fileName = photoUri.split('/').pop();

          // Replace the path to include the water-meter subfolder
          photoUri = photoUri.replace(`/${fileName}`, `/water-meter/${fileName}`);
          console.log('Corrected URI:', photoUri);
        }

        // Add the new photo to the meter's photo collection with corrected URI
        photos.push({
          id: asset.id,
          uri: photoUri,
          creationTime: new Date().getTime()
        });

        // Save updated photos list
        await AsyncStorage.setItem(meterPhotosKey, JSON.stringify(photos));
        console.log('Saved photo with URI:', photoUri);
      }

      Alert.alert(
        "Success",
        "Image saved successfully",
        [{ text: "OK", onPress: () => {
          // Navigate back to the water meter detail screen if meterID exists
          if (meterID) {
            router.push(`/water-meter/${meterID}`);
          } else {
            router.back();
          }
        }}]
      );
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save the image");
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