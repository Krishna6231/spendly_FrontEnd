import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";

type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
};
type CategoryItem = {
  category: string;
  limit: number;
};

interface ExpenseState {
  expenses: Expense[];
  categories: CategoryItem[];
}


const initialState: ExpenseState = {
  expenses: [],
  categories: [],
};

// Fetch expenses and categories
export const fetchExpensesAsync = createAsyncThunk(
  'expenses/fetchExpenses',
  async (userId: string, { rejectWithValue }) => {
    const access_token = await SecureStore.getItemAsync("accessToken");
    try {
      const response = await axios.get(
        `http://10.142.20.242:3000/expense/user?userid=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data; // { expenses, categories }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add expense
export const addExpenseAsync = createAsyncThunk(
  'expenses/addExpense',
  async (expensePayload: Expense, { rejectWithValue }) => {
    const access_token = await SecureStore.getItemAsync("accessToken");
    try {
      const response = await axios.post(
        'http://10.142.20.242:3000/expense/add',
        expensePayload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addExpenseAsync.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
      })
      .addCase(addExpenseAsync.rejected, (state, action) => {
        console.error('Failed to add expense:', action.payload);
      })
      .addCase(fetchExpensesAsync.fulfilled, (state, action) => {
        state.expenses = action.payload.expenses;
        state.categories = action.payload.categories;
      })
      .addCase(fetchExpensesAsync.rejected, (state, action) => {
        console.error('Failed to fetch expenses:', action.payload);
      });
  },
});

export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
