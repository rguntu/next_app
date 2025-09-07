import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addItem, updateItem } from '../services/Storage';

// Basic URL validation regex
const URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

const AddItemScreen = ({ navigation, route }) => {
  const existingItem = route.params?.item;

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [readLater, setReadLater] = useState(false);
  const [notes, setNotes] = useState('');
  // For simplicity, using a hardcoded category. A dropdown/picker would be an enhancement.
  const [category, setCategory] = useState('Article'); 

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setUrl(existingItem.url || '');
      setDueDate(existingItem.dueDate ? new Date(existingItem.dueDate) : new Date());
      setReadLater(existingItem.readLater || false);
      setNotes(existingItem.notes || '');
      setCategory(existingItem.category || 'Article');
      navigation.setOptions({ title: 'Edit Item' });
    }
  }, [existingItem, navigation]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Validation Error', 'Item name is required.');
      return;
    }
    if (url && !URL_REGEX.test(url)) {
      Alert.alert('Validation Error', 'Please enter a valid URL.');
      return;
    }

    const itemData = {
      category,
      name,
      url,
      dueDate: dueDate.toISOString(),
      readLater,
      notes,
    };

    try {
      if (existingItem) {
        await updateItem({ ...itemData, id: existingItem.id });
      } else {
        await addItem(itemData);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save item. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g., How to build a React Native app"
      />

      <Text style={styles.label}>URL</Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="https://example.com"
        keyboardType="url"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Notes / To-dos</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="- Finish section 1\n- Read comments"
        multiline
        numberOfLines={4}
      />

      <View style={styles.row}>
        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{dueDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Mark as 'Read Later'</Text>
        <Switch value={readLater} onValueChange={setReadLater} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddItemScreen;