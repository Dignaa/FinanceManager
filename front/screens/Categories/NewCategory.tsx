import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { addCategory } from '../../store/categorySlice';

const NewCategory = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch(addCategory({ title: text }));
    setText('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="New Category" onChangeText={setText} value={text} />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 },
});

export default NewCategory;
