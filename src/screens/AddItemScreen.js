import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Switch,
    Platform,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveItem, updateItem } from '../services/Storage';

const AddItemScreen = ({ navigation, route }) => {
    const existingItem = route.params?.item;
    const [name, setName] = useState(existingItem?.name || '');
    const [category, setCategory] = useState(existingItem?.category || '');
    const [url, setUrl] = useState(existingItem?.url || '');
    const [dueDate, setDueDate] = useState(
        existingItem ? new Date(existingItem.dueDate) : new Date()
    );
    const [readLater, setReadLater] = useState(existingItem?.readLater || false);
    const [todos, setTodos] = useState(existingItem?.todos || '');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Item name is required.');
            return;
        }

        const item = {
            id: existingItem?.id,
            name,
            category,
            url,
            dueDate: dueDate.toISOString(),
            readLater,
            todos,
        };

        if (existingItem) {
            await updateItem(item);
        } else {
            await saveItem(item);
        }
        navigation.goBack();
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dueDate;
        setShowDatePicker(Platform.OS === 'ios');
        setDueDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {existingItem ? 'Edit Item' : 'Add New Item'}
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
            />
            <TextInput
                style={styles.input}
                placeholder="URL"
                value={url}
                onChangeText={setUrl}
                keyboardType="url"
            />
            <View style={styles.dateContainer}>
                <Text>Due Date:</Text>
                <Button
                    onPress={() => setShowDatePicker(true)}
                    title={dueDate.toLocaleDateString()}
                />
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <View style={styles.switchContainer}>
                <Text>Read Later:</Text>
                <Switch value={readLater} onValueChange={setReadLater} />
            </View>
            <TextInput
                style={styles.input}
                placeholder="To-Do Items (comma-separated)"
                value={todos}
                onChangeText={setTodos}
                multiline
            />
            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
});

export default AddItemScreen;
