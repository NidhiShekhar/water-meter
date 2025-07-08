import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView as ExpoCameraView } from 'expo-camera';
import CameraOverlay from './CameraOverlay';

interface CameraViewProps {
  onCapture: (uri: string) => void;
  onClose?: () => void;
}

export type CameraRefType = {
  takePicture: () => Promise<void>;
};

const CameraViewComponent = forwardRef<CameraRefType, CameraViewProps>(
  ({ onCapture, onClose }, ref) => {
    const cameraRef = useRef<ExpoCameraView | null>(null);

    useImperativeHandle(ref, () => ({
      takePicture: async () => {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync();
          onCapture(photo.uri);
        }
      },
    }));

    return (
      <View style={styles.container}>
        <ExpoCameraView style={styles.camera} ref={cameraRef}>
          <CameraOverlay />

          {onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeIcon} />
            </TouchableOpacity>
          )}

          <View style={styles.captureButtonContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={async () => {
                if (cameraRef.current) {
                  const photo = await cameraRef.current.takePictureAsync();
                  onCapture(photo.uri);
                }
              }}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </ExpoCameraView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  closeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});

export default CameraViewComponent;