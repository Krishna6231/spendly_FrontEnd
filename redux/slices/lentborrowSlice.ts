// src/store/slices/lentBorrowSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";

// ─── Types ─────────────────────────────────────────────

export interface Loan {
  id: string;
  user_id: string;
  name: string;
  date: string;
  type: "lent" | "borrow";
  amount: number;
  installment: { amount: number; date: string }[];
}

interface LentBorrowState {
  data: Loan[];
  loading: boolean;
  error: string | null;
}

const initialState: LentBorrowState = {
  data: [],
  loading: false,
  error: null,
};

// ─── Async Thunks ──────────────────────────────────────

export const fetchAllLentBorrowAsync = createAsyncThunk(
  "lentBorrow/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/lend-borrow");
      return response.data as Loan[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addLentBorrowAsync = createAsyncThunk(
  "lentBorrow/add",
  async (
    payload: any, { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/lend-borrow/add", payload);
      console.log(response);
      return response.data as Loan;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateLentBorrowAsync = createAsyncThunk(
  "lentBorrow/update",
  async (
    payload: any, { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/lend-borrow/update/${payload.id}`, payload);
      return response.data as Loan;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteLentBorrowAsync = createAsyncThunk(
  "lentBorrow/delete",

  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/lend-borrow/delete/?id=${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }

);

// ─── Slice ─────────────────────────────────────────────

const lentBorrowSlice = createSlice({
  name: "lentBorrow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchAllLentBorrowAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLentBorrowAsync.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllLentBorrowAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ADD
      .addCase(addLentBorrowAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLentBorrowAsync.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.loading = false;
      })
      .addCase(addLentBorrowAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateLentBorrowAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLentBorrowAsync.fulfilled, (state, action) => {
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateLentBorrowAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteLentBorrowAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLentBorrowAsync.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteLentBorrowAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default lentBorrowSlice.reducer;
