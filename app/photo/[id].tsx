// app/photo/[id].tsx - Full photo view
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

export default function PhotoViewScreen() {
  const { id, meterId } = useLocalSearchParams();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhoto();
  }, []);

  const loadPhoto = async () => {
    try {
      const asset = await MediaLibrary.getAssetInfoAsync(id as string);
      if (asset) {
        setPhotoUri(asset.uri);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load photo:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.centered}>
          <Text>Photo not found</Text>
        </View>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});