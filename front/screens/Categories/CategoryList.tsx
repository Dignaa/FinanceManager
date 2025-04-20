import { useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/categorySlice';
import { RootState, AppDispatch } from '../../store/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logout } from '../../store/userSlice';

interface Category {
  id: string;
  title: string;
}

type StackParamList = {
  CategoryList: undefined;
  CategoryEdit: { id: string };
  CategoryDelete: { id: string };
  EntryList: { categoryId: string };
};

type NavigationProp = NativeStackNavigationProp<StackParamList, 'CategoryList'>;

const CategoryList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const categories = useSelector((state: RootState) => state.category.categories);
  const loading = useSelector((state: RootState) => state.category.loading);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoryEdit', { id: item.id })}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => navigation.navigate('CategoryDelete', { id: item.id })}>
          <Text style={[styles.buttonText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.viewButton]} onPress={() => navigation.navigate('EntryList', { categoryId: item.id })}>
          <Text style={styles.buttonText}>View Entries</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Categories</Text>
      {loading ? <Text style={styles.loading}>Loading...</Text> : (
        <FlatList data={categories} keyExtractor={(item) => item.id} renderItem={renderItem} />
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={() => dispatch(logout())}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  deleteText: {
    color: '#fff',
  },
  viewButton: {
    backgroundColor: '#28a745',
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CategoryList;
