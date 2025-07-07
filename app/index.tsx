import React, { useState, useRef } from 'react';
import { View, StyleSheet, Button, Image, Alert, Platform } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Rect, Mask } from 'react-native-svg';

export default function Index() {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  const requestPermissionAndShowCamera = async () => {
    if (Platform.OS === 'web') {
      console.log('Web platform detected, requesting camera access.');
      try {
        setHasPermission(true);
        setCameraVisible(true);
      } catch (error) {
        setHasPermission(false);
        Alert.alert('Permission required', 'Camera permission is needed to scan.');
      }
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        setCameraVisible(true);
      } else {
        setHasPermission(false);
        Alert.alert('Permission required', 'Camera permission is needed to scan.');
      }
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setCameraVisible(false);
    }
  };

  return (
      <View style={styles.container}>
        {!cameraVisible && !capturedImage && (
            <Button title="Scan" onPress={requestPermissionAndShowCamera} />
        )}
        {cameraVisible && (
            <CameraView style={styles.cameraView} ref={cameraRef}>
              <BlurView intensity={0} style={StyleSheet.absoluteFill}>
                <Svg style={StyleSheet.absoluteFill} height="100%" width="100%">
                  <Mask id="circleMask">
                    <Rect width="100%" height="100%" fill="white" />
                    <Circle cx="50%" cy="50%" r="33%" fill="black" />
                  </Mask>
                  <Rect
                      width="100%"
                      height="100%"
                      fill="rgba(0,0,0,0.6)"
                      mask="url(#circleMask)"
                  />
                  <Rect
                          x="20%"
                          y="35%"
                          width="60%"
                          height="10%"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                        />
                </Svg>
              </BlurView>
            </CameraView>
        )}
        {cameraVisible && <Button title="Capture" onPress={handleCapture} />}
        {capturedImage && (
            <View>
              <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
              <Button title="Retake" onPress={() => setCapturedImage(null)} />
            </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
});