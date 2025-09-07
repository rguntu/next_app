import AsyncStorage from '@react-native-async-storage/async-storage';

const ITEMS_KEY = 'items';

// Helper to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Gets all items from local storage.
 * @returns {Promise<Array>} A promise that resolves to an array of items.
 */
export const getItems = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(ITEMS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch items from storage', e);
    return [];
  }
};

/**
 * Adds a new item to local storage.
 * @param {object} item - The item to add, without an ID.
 * @returns {Promise<object>} A promise that resolves to the newly created item.
 */
export const addItem = async (item) => {
  try {
    const items = await getItems();
    const newItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    return newItem;
  } catch (e) {
    console.error('Failed to add item to storage', e);
  }
};

/**
 * Updates an existing item in local storage.
 * @param {object} updatedItem - The item with updated properties.
 * @returns {Promise<object>} A promise that resolves to the updated item.
 */
export const updateItem = async (updatedItem) => {
  try {
    const items = await getItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...updatedItem,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
      return items[index];
    }
  } catch (e) {
    console.error('Failed to update item in storage', e);
  }
};

/**
 * Deletes an item from local storage.
 * @param {string} id - The ID of the item to delete.
 * @returns {Promise<void>}
 */
export const deleteItem = async (id) => {
  try {
    const items = await getItems();
    const newItems = items.filter(item => item.id !== id);
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(newItems));
  } catch (e) {
    console.error('Failed to delete item from storage', e);
  }
};