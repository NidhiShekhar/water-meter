// app/photo.tsx
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

export default function PhotoViewScreen() {
  const { uri, id } = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(uri ? decodeURIComponent(uri as string) : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssetUri = async () => {
      // If we have an ID, try to get the fresh URI from MediaLibrary
      if (id) {
        try {
          setLoading(true);
          const asset = await MediaLibrary.getAssetInfoAsync(id as string);
          setImageUri(asset.uri);
          setError(null);
        } catch (err) {
          console.error('Failed to load asset:', err);
          setError('Failed to load image');
          // Keep the passed URI as fallback
        } finally {
          setLoading(false);
        }
      }
    };

    loadAssetUri();
  }, [id]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="white" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Image
          source={{ uri: imageUri || '' }}
          style={styles.image}
          resizeMode="contain"
          onError={(e) => console.error('Image error:', e.nativeEvent.error)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  loader: {
    alignSelf: 'center',
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    padding: 20,
  }
});