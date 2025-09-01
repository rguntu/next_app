import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { getItems, deleteItem } from '../services/Storage';
import { logout } from '../services/Appwrite';

const HomeScreen = ({ navigation }) => {
    const [items, setItems] = useState([]);

    const loadItems = async () => {
        const storedItems = await getItems();
        setItems(storedItems);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadItems();
        });
        return unsubscribe;
    }, [navigation]);

    const handleDelete = (itemId) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: async () => {
                        await deleteItem(itemId);
                        loadItems();
                    },
                },
            ]
        );
    };

    const handleLogout = async () => {
        await logout();
        navigation.replace('Login');
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text>Category: {item.category}</Text>
                <Text>URL: {item.url}</Text>
                <Text>Due Date: {new Date(item.dueDate).toLocaleDateString()}</Text>
                <Text>Read Later: {item.readLater ? 'Yes' : 'No'}</Text>
                <Text>To-Do: {item.todos}</Text>
            </View>
            <View style={styles.itemActions}>
                <Button
                    title="Edit"
                    onPress={() => navigation.navigate('AddItem', { item })}
                />
                <Button
                    title="Delete"
                    onPress={() => handleDelete(item.id)}
                    color="red"
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Items</Text>
                <Button title="Logout" onPress={handleLogout} />
            </View>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text>No items found. Add one!</Text>}
            />
            <Button
                title="Add Item"
                onPress={() => navigation.navigate('AddItem')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemActions: {
        justifyContent: 'space-around',
    },
});

export default HomeScreen;
