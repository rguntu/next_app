import AsyncStorage from '@react-native-async-storage/async-storage';

const ITEMS_KEY = 'items';

export const getItems = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(ITEMS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Error getting items:', error);
        return [];
    }
};

export const saveItem = async (item) => {
    try {
        const items = await getItems();
        const newItems = [...items, { ...item, id: Date.now().toString() }];
        const jsonValue = JSON.stringify(newItems);
        await AsyncStorage.setItem(ITEMS_KEY, jsonValue);
    } catch (error) {
        console.error('Error saving item:', error);
    }
};

export const updateItem = async (updatedItem) => {
    try {
        const items = await getItems();
        const newItems = items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
        );
        const jsonValue = JSON.stringify(newItems);
        await AsyncStorage.setItem(ITEMS_KEY, jsonValue);
    } catch (error) {
        console.error('Error updating item:', error);
    }
};

export const deleteItem = async (itemId) => {
    try {
        const items = await getItems();
        const newItems = items.filter((item) => item.id !== itemId);
        const jsonValue = JSON.stringify(newItems);
        await AsyncStorage.setItem(ITEMS_KEY, jsonValue);
    } catch (error) {
        console.error('Error deleting item:', error);
    }
};
