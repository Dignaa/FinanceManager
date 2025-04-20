import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logIn, signUp } from './../../store/userSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface LoginScreenProps {}

const LogIn: React.FC<LoginScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>()
    const error = useSelector((state: RootState) => state.user.error)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NavigationProp>();

    type StackParamList = {
      SignUp: undefined;
    };
    
    type NavigationProp = NativeStackNavigationProp<StackParamList, 'SignUp'>;

  const handleSubmit = async () => {
    dispatch(logIn({ email, password }))
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Text>{error}</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
      />
      <Button title="Login" onPress={handleSubmit} />

          <Text>
              Create an account
                         </Text>
        <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
  
    </View>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});