import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

const apiUrl = "http://192.168.0.101:3000";

interface UserState {
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  token: null,
};

export const signUp = createAsyncThunk(
  'users/signup',
  async ({ email, password }: { email: string, password: string }) => {
    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to Sign Up');
      }
      const newUser = await response.json();
      return newUser;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }
);

export const logIn = createAsyncThunk(
  'users/signIn',
  async ({ email, password }: { email: string, password: string }) => {
    try {
      const response = await fetch(`${apiUrl}/auth/signin`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Log In failed');
      }

      const data = await response.json();

      await SecureStore.setItemAsync('token', data.access_token);
      return data.access_token;

    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      SecureStore.setItemAsync('token', '');
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to log in';
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to sign up';
      });
  },
});

export const { logout, setToken } = userSlice.actions;

export default userSlice.reducer;
