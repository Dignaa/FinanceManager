import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './categorySlice';
import userReducer from './userSlice';
import entryReducer from './entrySlice';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    user: userReducer,
    entry: entryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;