// screens/EntryEdit.tsx

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { editEntry } from '../../store/entrySlice';
import { Picker } from '@react-native-picker/picker';

type RouteParams = { id: string };
const apiUrl = "http://192.168.0.101:3000"; // Replace with your API URL

const EntryEdit = () => {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [picture, setPicture] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getEntry(id);
    getCategories();
  }, [id]);

  const getEntry = async (id: string) => {
    const response = await fetch(`${apiUrl}/entries/${id}`, { method: 'GET' });
    const data = await response.json();
    setTitle(data.title);
    setAmount(data.amount.toString());
    setCurrency(data.currency);
    setCategoryId(data.categoryId);
    setDate(data.date);
    setPicture(data.picture);
  };

  const getCategories = async () => {
    const response = await fetch(`${apiUrl}/categories`, { method: 'GET' });
    const data = await response.json();
    setCategories(data);
  };

  const handleSave = () => {
    if (!title.trim() || !amount || !currency || !categoryId) return;

    const updatedEntry = {
      id: id as string,
      title,
      amount: parseFloat(amount),
      currency,
      categoryId,
      date,
      picture,
    };

    dispatch(editEntry(updatedEntry));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Currency"
        value={currency}
        onChangeText={setCurrency}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Picture URL"
        value={picture}
        onChangeText={setPicture}
      />
      
      <Picker
        selectedValue={categoryId}
        onValueChange={(itemValue) => setCategoryId(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Category" value="" />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.title} value={category.id} />
        ))}
      </Picker>

      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 },
});

export default EntryEdit;
