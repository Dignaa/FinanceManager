// screens/DeleteEntry.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { deleteEntry } from '../../store/entrySlice';
import { AppDispatch } from '../../store/store';

type RouteParams = { id: string };

const DeleteEntry = () => {
  const route = useRoute();
  const { id } = route.params as RouteParams;
  
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const handleDelete = () => {
    dispatch(deleteEntry(id));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Are you sure you want to delete this entry?</Text>
      <Button title="Delete" onPress={handleDelete} color="red" />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
});

export default DeleteEntry;
