import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

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

type SubscriptionItem = {
  subscription: string;
  amount: number;
  autopay_date: number;
};

interface ExpenseState {
  expenses: Expense[];
  categories: CategoryItem[];
  subscriptions: SubscriptionItem[];
  loading: boolean;
}

const initialState: ExpenseState = {
  expenses: [],
  categories: [],
  subscriptions: [],
  loading: false,
};

const getAccessToken = async () => await SecureStore.getItemAsync("token");

// ─── Async Thunks ─────────────────────────────────────────────────────

export const fetchExpensesAsync = createAsyncThunk(
  "expenses/fetchExpenses",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const response = await axios.get(
        `https://api.moneynut.co.in/expense/user?userid=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addExpenseAsync = createAsyncThunk(
  "expenses/addExpense",
  async (expensePayload: Expense, { rejectWithValue }) => {
    try {
      const token = await getAccessToken();
      const response = await axios.post(
        "https://api.moneynut.co.in/expense/add",
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
  "expenses/addCategory",
  async (
    payload: {
      user_id: string;
      category: string;
      limit: number;
      color: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = await getAccessToken();
      const response = await axios.post(
        "https://api.moneynut.co.in/expense/add-category",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "expenses/deleteCategory",
  async (
    payload: { user_id: string; category: string },
    { rejectWithValue }
  ) => {
    try {
      const token = await getAccessToken();
      const response = await axios.post(
        "https://api.moneynut.co.in/expense/delete-category",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteSubscriptionAsync = createAsyncThunk(
  "expenses/deleteSubscription",
  async (
    payload: { user_id: string; subscription: string },
    { rejectWithValue }
  ) => {
    try {
      const token = await getAccessToken();
      const response = await axios.post(
        "https://api.moneynut.co.in/expense/delete-subscription",
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
  "expenses/editCategory",
  async (
    payload: {
      user_id: string;
      category: string;
      limit: number;
      color: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = await getAccessToken();
      const response = await axios.put(
        "https://api.moneynut.co.in/expense/edit-category",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addSubscriptionAsync = createAsyncThunk(
  "expenses/addSubscription",
  async (
    payload: {
      user_id: string;
      subscription: string;
      amount: number;
      autopay_date: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = await getAccessToken();
      const response = await axios.post(
        "https://api.moneynut.co.in/expense/add-subscription",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editSubscriptionAsync = createAsyncThunk(
  "expenses/editSubscription",
  async (
    payload: {
      user_id: string;
      subscription: string;
      amount: number;
      autopay_date: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = await getAccessToken();
      const response = await axios.put(
        "https://api.moneynut.co.in/expense/edit-subscription",
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
  "expenses/deleteExpense",
  async (
    payload: { expenseId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const token = await getAccessToken();
      await axios.delete(
        `https://api.moneynut.co.in/expense/delete?expenseId=${payload.expenseId}&userId=${payload.userId}`,
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
  name: "expenses",
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
        state.subscriptions = action.payload.subscriptions;
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

      //DELETE CATEGORY
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.category !== action.payload.category
        );
        state.loading = false;
      })
      .addCase(deleteCategoryAsync.rejected, (state) => {
        state.loading = false;
      })

      // EDIT CATEGORY
      .addCase(editCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(editCategoryAsync.fulfilled, (state, action) => {
        const { category, limit } = action.payload;
        const index = state.categories.findIndex(
          (cat) => cat.category === category
        );
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
        state.expenses = state.expenses.filter(
          (exp) => exp.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteExpenseAsync.rejected, (state) => {
        state.loading = false;
      })

      //ADD SUBSCRIPTION
      .addCase(addSubscriptionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSubscriptionAsync.fulfilled, (state, action) => {
        state.subscriptions.push(action.payload);
        state.loading = false;
      })
      .addCase(addSubscriptionAsync.rejected, (state) => {
        state.loading = false;
      })

      //EDIT SUBSCRIPTION
      .addCase(editSubscriptionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(editSubscriptionAsync.fulfilled, (state, action) => {
        const { subscription, amount, autopay_date } = action.payload;
        const index = state.subscriptions.findIndex(
          (cat) => cat.subscription === subscription
        );
        if (index !== -1) {
          state.subscriptions[index].amount = amount;
          state.subscriptions[index].autopay_date = autopay_date;
        }
        state.loading = false;
      })
      .addCase(editSubscriptionAsync.rejected, (state) => {
        state.loading = false;
      })

      //DELETE SUBSCRIPTION
      .addCase(deleteSubscriptionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSubscriptionAsync.fulfilled, (state, action) => {
        state.subscriptions = state.subscriptions.filter(
          (sub) => sub.subscription !== action.payload.subscription
        );
        state.loading = false;
      })
      .addCase(deleteSubscriptionAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;