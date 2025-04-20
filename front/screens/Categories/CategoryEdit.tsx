import { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { editCategory } from '../../store/categorySlice';

type RouteParams = { id: string };
const apiUrl = "http://192.168.0.101:3000";

const CategoryEdit = () => {
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const [text, setText] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  useEffect(() => {
    getCategory(id)
  }, [id]);

  const handleSave = () => {
    if (!text.trim()) return;
    dispatch(editCategory({ id, title: text }));
    navigation.goBack();
  };

  const getCategory = (async(id: String)=> {
  const response = await fetch(`${apiUrl}/categories/${id}`, { method: 'GET' });
    const data = await response.json();
    setText(data.title);
})

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Edit Category" onChangeText={setText} value={text} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 },
});

export default CategoryEdit;
