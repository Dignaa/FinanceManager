import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import * as SecureStore from 'expo-secure-store';
import { RootState } from './store/store';
import { setToken } from './store/userSlice';

import CategoryList from './screens/Categories/CategoryList';
import CategoryEdit from './screens/Categories/CategoryEdit';
import CategoryDelete from './screens/Categories/CategoryDelete';
import NewCategory from './screens/Categories/NewCategory';

import EntryList from './screens/Entries/EntryList';
import EntryEdit from './screens/Entries/EntryEdit';
import EntryDelete from './screens/Entries/EntryDelete';
import NewEntry from './screens/Entries/NewEntry';

import SignUp from './screens/Auth/SignUp';
import LogIn from './screens/Auth/LogIn';

export type StackParamList = {
  CategoryList: undefined;
  CategoryEdit: { id: number };
  CategoryDelete: { id: number };
  EntryList: { categoryId: number };
  EntryEdit: { id: number };
  EntryDelete: { id: number };
  SignUp: undefined;
  LogIn: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

function ListStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CategoryList" component={CategoryList} />
      <Stack.Screen name="CategoryEdit" component={CategoryEdit} />
      <Stack.Screen name="CategoryDelete" component={CategoryDelete} />
      <Stack.Screen name="EntryList" component={EntryList} />
      <Stack.Screen name="EntryEdit" component={EntryEdit} />
      <Stack.Screen name="EntryDelete" component={EntryDelete} />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="List" component={ListStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="New Category" component={NewCategory} />
      <Tab.Screen name="New Entry" component={NewEntry} />
    </Tab.Navigator>
  );
}

function MainNavigator() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token); 

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        if (storedToken) {
          dispatch(setToken(storedToken));
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    
    loadToken();
  }, [dispatch]);

  return token ? <HomeTabs /> : <AuthStack />;
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}
