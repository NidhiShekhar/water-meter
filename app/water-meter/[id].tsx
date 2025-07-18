// app/water-meter/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as MediaLibrary from 'expo-media-library';

interface PhotoItem {
  id: string;
  uri: string;
  creationTime: number;
}

export default function WaterMeterDetailScreen() {
  const { id } = useLocalSearchParams();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Move debugStorage inside the component
  const debugStorage = async () => {
    const meterPhotosKey = `meter-photos-${id}`;
    const storedPhotos = await AsyncStorage.getItem(meterPhotosKey);
    console.log(`Photos for meter ${id}:`, storedPhotos);
  };

  // Request media library permissions right away
  useEffect(() => {
    debugStorage();
    fixPhotoUris();
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Media library permission denied');
      }
    })();
  }, [id]);

  // Load photos whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadPhotos();
      return () => {}; // Cleanup function
    }, [id])
  );

 // Modify your loadPhotos function in app/water-meter/[id].tsx

 const loadPhotos = async () => {
   if (!id) return;

   try {
     setLoading(true);
     const meterPhotosKey = `meter-photos-${id}`;
     const storedPhotos = await AsyncStorage.getItem(meterPhotosKey);
     console.log(`Loading photos for meter ${id}, found:`, storedPhotos);

     if (storedPhotos) {
       // Parse the stored photos but don't try to validate through MediaLibrary
       let photoItems = JSON.parse(storedPhotos);
       setPhotos(photoItems);
       console.log(`Photos loaded: ${photoItems.length}`);
     }
   } catch (error) {
     console.error('Failed to load photos:', error);
   } finally {
     setLoading(false);
     setRefreshing(false);
   }
 };

  const onRefresh = () => {
    setRefreshing(true);
    loadPhotos();
  };
const fixPhotoUris = async () => {
  try {
    const meterPhotosKey = `meter-photos-${id}`;
    const storedPhotos = await AsyncStorage.getItem(meterPhotosKey);

    if (storedPhotos) {
      let photoItems = JSON.parse(storedPhotos);

      // Fix each URI to include the water-meter subfolder
      const fixedPhotos = photoItems.map(photo => {
        if (!photo.uri.includes('/water-meter/')) {
          const fileName = photo.uri.split('/').pop();
          photo.uri = photo.uri.replace(`/${fileName}`, `/water-meter/${fileName}`);
        }
        return photo;
      });

      await AsyncStorage.setItem(meterPhotosKey, JSON.stringify(fixedPhotos));
      setPhotos(fixedPhotos);
      console.log('Fixed photo URIs');
    }
  } catch (error) {
    console.error('Error fixing URIs:', error);
  }
};
  const renderPhotoItem = ({ item }: { item: PhotoItem }) => {
      const formattedDate = format(
          new Date(item.creationTime),
          'MMM dd, yyyy - h:mm a'
        );
    return (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => router.push(`/photo?uri=${encodeURIComponent(item.uri)}&id=${item.id}&meterId=${id}`)}
    >
    <Image
      source={{ uri: item.uri }}
      style={styles.thumbnail}
      onError={(e) => console.error('Image loading error for URI:', item.uri, e.nativeEvent.error)}
    />
    <Text style={styles.dateText}>{formattedDate}</Text>
    </TouchableOpacity>
  );
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Meter {id}</Text>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : photos.length > 0 ? (
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.photoGrid}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.centered}>
          <Text>No photos yet</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => router.push(`/camera?meterID=${id}`)}
      >
        <Text style={styles.cameraButtonText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 40,
  },
  photoGrid: {
    paddingBottom: 80,
  },
  photoItem: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e0e0e0', // Placeholder color
  },
  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cameraButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  refreshButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
  }
});