import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
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

// Add Category
export const addCategoryAsync = createAsyncThunk(
  'expenses/addCategory',
  async (categoryPayload: { user_id: string; category: string; limit: number }, { rejectWithValue }) => {
    const access_token = await SecureStore.getItemAsync("accessToken");
    try {
      const response = await axios.post(
        'http://192.168.1.4:3000/expense/add-category',
        categoryPayload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data; // the created category object
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Edit Category
export const editCategoryAsync = createAsyncThunk(
  'expenses/editCategory',
  async (
    payload: { user_id: string; category: string; limit: number },
    { rejectWithValue }
  ) => {
    const access_token = await SecureStore.getItemAsync("accessToken");
    try {
      const response = await axios.put(
        'http://192.168.1.4:3000/expense/edit-category',
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data; // Should return updated category
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Fetch expenses and categories
export const fetchExpensesAsync = createAsyncThunk(
  'expenses/fetchExpenses',
  async (userId: string, { rejectWithValue }) => {
    const access_token = await SecureStore.getItemAsync("accessToken");
    try {
      const response = await axios.get(
        `http://192.168.1.4:3000/expense/user?userid=${userId}`,
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
        'http://192.168.1.4:3000/expense/add',
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

export const deleteExpenseAsync = createAsyncThunk(
  'expenses/deleteExpense',
  async (
    payload: { expenseId: string; userId: string },
    { rejectWithValue }
  ) => {
    const access_token = await SecureStore.getItemAsync("accessToken");
    try {
      await axios.delete(
        `http://192.168.1.4:3000/expense/delete?expenseId=${payload.expenseId}&userId=${payload.userId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return payload.expenseId; // We'll use this to remove from local state
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
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(addCategoryAsync.rejected, (state, action) => {
        console.error("Failed to add category:", action.payload);
      })
      .addCase(editCategoryAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.categories.findIndex(cat => cat.category === updated.category);
        if (index !== -1) {
          state.categories[index].limit = updated.limit;
        }
      })
      .addCase(editCategoryAsync.rejected, (state, action) => {
        console.error("Failed to edit category:", action.payload);
      })
      .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
      })
      .addCase(deleteExpenseAsync.rejected, (state, action) => {
        console.error("Failed to delete expense:", action.payload);
      });
      
  },
});

export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
