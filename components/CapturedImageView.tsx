import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

interface CapturedImageViewProps {
  imageUri: string;
  onRetake: () => void;
  onAccept?: () => void;
}

export default function CapturedImageView({
  imageUri,
  onRetake,
  onAccept
}: CapturedImageViewProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onRetake}>
          <Text style={styles.actionText}>Retake</Text>
        </TouchableOpacity>

        {onAccept && (
          <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={onAccept}>
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
  },
  acceptButton: {
    backgroundColor: 'rgba(0, 120, 0, 0.6)',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});