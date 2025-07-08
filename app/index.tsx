// app/index.tsx
import { router } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WATER METER SCANNER</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Align the reading on your water meter with the rectangular overlay on the camera.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push('/camera')}
      >
        <Text style={styles.scanButtonText}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginHorizontal: 30,
    marginBottom: 150,
    borderRadius: 10,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});