import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries, deleteEntry } from '../../store/entrySlice';
import { RootState, AppDispatch } from '../../store/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Entry {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: string;
  picture: string;
  categoryId: string;
}

type StackParamList = {
  EntryList: { categoryId: string };
  EntryEdit: { id: string };
};

type NavigationProp = NativeStackNavigationProp<StackParamList, 'EntryList'>;

const EntryList = ({ route }: any) => {
  const { categoryId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const entries = useSelector((state: RootState) => state.entry.entries);
  const loading = useSelector((state: RootState) => state.entry.loading);
  const error = useSelector((state: RootState) => state.entry.error);

  useEffect(() => {
    dispatch(fetchEntries(categoryId));
  }, [dispatch, categoryId]);

  const handleDelete = (id: string) => {
    dispatch(deleteEntry(id));
  };

  const renderItem = ({ item }: { item: Entry }) => (
    <View style={styles.card}>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>{item.amount} {item.currency}</Text>
        <Text style={styles.details}>{item.date}</Text>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EntryEdit', { id: item.id })}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item.id)}>
          <Text style={[styles.buttonText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Entries</Text>
      {loading ? (
        <Text style={styles.status}>Loading...</Text>
      ) : error ? (
        <Text style={styles.status}>{error}</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  status: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  textGroup: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteText: {
    color: '#fff',
  },
});

export default EntryList;
