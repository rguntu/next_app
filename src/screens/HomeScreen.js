import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getItems, deleteItem } from '../services/Storage';

const HomeScreen = ({ navigation, onLogout }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadItems = async () => {
        setIsLoading(true);
        const storedItems = await getItems();
        setItems(storedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setIsLoading(false);
      };
      loadItems();
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onLogout} style={{ marginRight: 10 }}>
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, onLogout]);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(id);
            // Refresh list after deletion
            const storedItems = await getItems();
            setItems(storedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          },
        },
      ]
    );
  };

  const handleLinkPress = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open the URL.'));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemCategory}>{item.category}</Text>
      <Text style={styles.itemName}>{item.name}</Text>
      {item.url ? (
        <TouchableOpacity onPress={() => handleLinkPress(item.url)}>
          <Text style={styles.itemUrl}>🔗 {item.url}</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.itemMeta}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
      {item.notes ? <Text style={styles.itemNotes}>Notes: {item.notes}</Text> : null}
      <View style={styles.itemFooter}>
        <Text style={styles.itemReadLater}>{item.readLater ? '📖 Read Later' : ''}</Text>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => navigation.navigate('AddItem', { item })}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 15 }}>
            <Text style={[styles.actionText, { color: '#FF3B30' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return <View style={styles.centered}><Text>Loading...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No items yet.</Text>
          <TouchableOpacity style={styles.firstButton} onPress={() => navigation.navigate('AddItem')}>
            <Text style={styles.firstButtonText}>Add Your First Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddItem')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#888', marginBottom: 20 },
  firstButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  firstButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  itemContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemCategory: { fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'uppercase' },
  itemName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  itemUrl: { fontSize: 14, color: '#007AFF', marginBottom: 8 },
  itemMeta: { fontSize: 12, color: '#555', marginBottom: 8 },
  itemNotes: { fontSize: 14, color: '#333', fontStyle: 'italic', marginTop: 5 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
  itemReadLater: { fontSize: 12, fontWeight: '600', color: '#34C759' },
  itemActions: { flexDirection: 'row' },
  actionText: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabText: { fontSize: 30, color: 'white' },
});

export default HomeScreen;