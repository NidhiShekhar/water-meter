// app/index.tsx - Home screen with water meter list
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, TextInput, Modal } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [newMeterName, setNewMeterName] = useState('');
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

// Update this function to show the dialog instead of creating a meter
const addWaterMeter = () => {
  setNewMeterName(''); // Start with empty input instead of default name
  setModalVisible(true);
};

// Add this function to handle saving with a custom name
const saveNewMeter = async () => {
  const newId = String(waterMeters.length + 1);
  const newMeter = {
    id: newId,
    name: newMeterName.trim() || `Water Meter ${newId}`, // Use custom name or default if empty
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

  setModalVisible(false);
  setNewMeterName('');
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Water Meter</Text>

              <TextInput
                style={styles.input}
                value={newMeterName}
                onChangeText={setNewMeterName}
                placeholder="Enter water meter name"
                autoFocus={true}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={saveNewMeter}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontWeight: '500',
    color: '#fff',
  },
  cancelButtonText: {
    fontWeight: '500',
    color: '#333',
  },
});