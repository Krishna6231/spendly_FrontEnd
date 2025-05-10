import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
};

type CategoryItem = {
  color: string;
  category: string;
  limit: number;
};

interface ExpenseState {
  expenses: Expense[];
  categories: CategoryItem[];
  loading: boolean;
}

const initialState: ExpenseState = {
  expenses: [],
  categories: [],
  loading: false,
};

const getAccessToken = async () => await SecureStore.getItemAsync('accessToken');

// ─── Async Thunks ─────────────────────────────────────────────────────

export const fetchExpensesAsync = createAsyncThunk(
  'expenses/fetchExpenses',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const response = await axios.get(
        `https://spendly-backend-5rgu.onrender.com/expense/user?userid=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addExpenseAsync = createAsyncThunk(
  'expenses/addExpense',
  async (expensePayload: Expense, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const response = await axios.post(
        'https://spendly-backend-5rgu.onrender.com/expense/add',
        expensePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCategoryAsync = createAsyncThunk(
  'expenses/addCategory',
  async (payload: { user_id: string; category: string; limit: number; color: string }, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const response = await axios.post(
        'https://spendly-backend-5rgu.onrender.com/expense/add-category',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editCategoryAsync = createAsyncThunk(
  'expenses/editCategory',
  async (payload: { user_id: string; category: string; limit: number; color: string}, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const response = await axios.put(
        'https://spendly-backend-5rgu.onrender.com/expense/edit-category',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteExpenseAsync = createAsyncThunk(
  'expenses/deleteExpense',
  async (payload: { expenseId: string; userId: string }, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      await axios.delete(
        `https://spendly-backend-5rgu.onrender.com/expense/delete?expenseId=${payload.expenseId}&userId=${payload.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return payload.expenseId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ─── Slice ──────────────────────────────────────────────────────────────

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH EXPENSES
      .addCase(fetchExpensesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpensesAsync.fulfilled, (state, action) => {
        state.expenses = action.payload.expenses;
        state.categories = action.payload.categories;
        state.loading = false;
      })
      .addCase(fetchExpensesAsync.rejected, (state) => {
        state.loading = false;
      })

      // ADD EXPENSE
      .addCase(addExpenseAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExpenseAsync.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
        state.loading = false;
      })
      .addCase(addExpenseAsync.rejected, (state) => {
        state.loading = false;
      })

      // ADD CATEGORY
      .addCase(addCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        state.loading = false;
      })
      .addCase(addCategoryAsync.rejected, (state) => {
        state.loading = false;
      })

      // EDIT CATEGORY
      .addCase(editCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(editCategoryAsync.fulfilled, (state, action) => {
        const { category, limit } = action.payload;
        const index = state.categories.findIndex((cat) => cat.category === category);
        if (index !== -1) {
          state.categories[index].limit = limit;
        }
        state.loading = false;
      })
      .addCase(editCategoryAsync.rejected, (state) => {
        state.loading = false;
      })

      // DELETE EXPENSE
      .addCase(deleteExpenseAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((exp) => exp.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteExpenseAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
