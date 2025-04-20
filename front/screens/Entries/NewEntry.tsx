// screens/NewEntry.tsx

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { addEntry } from '../../store/entrySlice';
import { fetchCategories } from '../../store/categorySlice';
import { RootState } from '../../store/store';
import { Picker } from '@react-native-picker/picker';

const NewEntry = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  
  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const categories = useSelector((state: RootState) => state.category.categories);

  const handleAdd = () => {
    if (!title.trim() || !amount || !currency || !categoryId) return;
    const entry = {
      title,
      amount: parseFloat(amount),
      currency,
      date: new Date().toISOString(),
      picture: '',
      categoryId,
    };
    dispatch(addEntry(entry));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        onChangeText={setAmount}
        value={amount}
      />
      <TextInput
        style={styles.input}
        placeholder="Currency"
        onChangeText={setCurrency}
        value={currency}
      />
      <Picker
        selectedValue={categoryId}
        onValueChange={(itemValue : string) => setCategoryId(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Category" value="" />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.title} value={category.id.toString()} />
        ))}
      </Picker>
      <Button title="Add Entry" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 },
});

export default NewEntry;
