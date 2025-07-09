// components/CapturedImageView.tsx
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface Props {
  imageUri: string;
  onRetake: () => void;
  onAccept: () => void;
  isSaving?: boolean;
}

export default function CapturedImageView({ imageUri, onRetake, onAccept, isSaving = false }: Props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onRetake}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={onAccept}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Accept</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 30, // Add this to move buttons higher
    position: 'absolute', // Make buttons overlay the image
    bottom: 0,
    left: 0,
    right: 0,
  },

  button: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});