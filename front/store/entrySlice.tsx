// store/entriesSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const apiUrl = "http://192.168.0.101:3000";

interface Entry {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: string;
  picture: string;
  categoryId: string;
}

interface EntriesState {
  entries: Entry[];
  loading: boolean;
  error: string | null;
}

const initialState: EntriesState = {
  entries: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchEntries = createAsyncThunk('entries/fetchEntries', async (categoryId: string) => {
  try {
    const response = await fetch(`${apiUrl}/entries?categoryId=${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }
});

export const addEntry = createAsyncThunk(
  'entries/addEntry',
  async (entry: {
  title: string;
  amount: number;
  currency: string;
  date: string;
  picture: string;
  categoryId: string;
}) => {
    try {
      const response = await fetch(`${apiUrl}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) {
        throw new Error('Failed to add entry');
      }
      const newEntry = await response.json();
      return newEntry;
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  }
);

export const editEntry = createAsyncThunk(
  'entries/editEntry',
  async (entry: Entry) => {
    try {
      const response = await fetch(`${apiUrl}/entries/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) {
        throw new Error('Failed to edit entry');
      }
      const updatedEntry = await response.json();
      return updatedEntry;
    } catch (error) {
      console.error('Error editing entry:', error);
      throw error;
    }
  }
);

export const deleteEntry = createAsyncThunk(
  'entries/deleteEntry',
  async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/entries/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }
      return id;
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }
);

// Slice
const entriesSlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load entries';
      })

      .addCase(addEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.push(action.payload);
      })
      .addCase(addEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to add entry';
      })

      .addCase(editEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(editEntry.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEntry = action.payload;
        const index = state.entries.findIndex((entry) => entry.id === updatedEntry.id);
        if (index !== -1) {
          state.entries[index] = updatedEntry;
        }
      })
      .addCase(editEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to edit entry';
      })

      .addCase(deleteEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter((entry) => entry.id !== action.payload);
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to delete entry';
      });
  },
});

export default entriesSlice.reducer;
