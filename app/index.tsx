// app/index.tsx - Home screen with water meter list
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WaterMeter {
  id: string;
  name: string;
  latestImageUri: string | null;
  latestReading: string | null;
  timestamp: number | null;
}

export default function HomeScreen() {
  const [waterMeters, setWaterMeters] = useState<WaterMeter[]>([]);

  useEffect(() => {
    loadWaterMeters();
  }, []);

  const loadWaterMeters = async () => {
    try {
      const storedMeters = await AsyncStorage.getItem('waterMeters');
      if (storedMeters) {
        setWaterMeters(JSON.parse(storedMeters));
      } else {
        // Default water meters if none exist
        const defaultMeters = [
          {
            id: '1',
            name: 'Water Meter 1',
            latestImageUri: null,
            latestReading: '0.00',
            timestamp: Date.now()
          },
          {
            id: '2',
            name: 'Water Meter 2',
            latestImageUri: null,
            latestReading: '0.00',
            timestamp: Date.now()
          }
        ];
        await AsyncStorage.setItem('waterMeters', JSON.stringify(defaultMeters));
        setWaterMeters(defaultMeters);
      }
    } catch (error) {
      console.error('Failed to load water meters:', error);
    }
  };

  const addWaterMeter = async () => {
    const newId = String(waterMeters.length + 1);
    const newMeter = {
    id: newId,
    name: `Water Meter ${newId}`,
    latestImageUri: null,
    latestReading: null,
    timestamp: null
    };

    const updatedMeters = [...waterMeters, newMeter];
    setWaterMeters(updatedMeters);

    try {
      await AsyncStorage.setItem('waterMeters', JSON.stringify(updatedMeters));
    } catch (error) {
      console.error('Failed to save new water meter:', error);
    }
  };

const renderWaterMeter = ({ item }: { item: WaterMeter }) => (
  <TouchableOpacity
    style={styles.meterItem}
    onPress={() => router.push(`/water-meter/${item.id}`)}
  >
    <View style={styles.meterLeftSection}>
      <View style={styles.thumbnailContainer}>
        {item.latestImageUri ? (
          <Image source={{ uri: item.latestImageUri }} style={styles.thumbnail} />
        ) : (
          <Ionicons name="camera-outline" size={32} color="#cccccc" />
        )}
      </View>
    </View>
    <View style={styles.meterInfo}>
      <Text style={styles.meterName}>{item.name}</Text>
      <Text style={styles.meterReading}>
        Last reading: {item.latestReading || "0.0"} m³ •
        {item.timestamp ?
          ` ${new Date(item.timestamp).toLocaleString()}` :
          ' N/A'}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#555" />
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Meters</Text>

      <FlatList
        data={waterMeters}
        renderItem={renderWaterMeter}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.addButton} onPress={addWaterMeter}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Water Meter</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  list: {
    paddingBottom: 80,
  },
  meterItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  meterName: {
    fontSize: 18,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    marginTop: 54,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 1,
    fontWeight: 'bold',
  },
  // Add to the styles
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  meterLeftSection: {
    marginRight: 16,
  },
  meterInfo: {
    flex: 1,
  },
  meterReading: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  meterItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});