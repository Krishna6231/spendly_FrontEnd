import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './slices/expenseSlice';
import analyticsReducer from './slices/analyticsSlice';
import lentBorrowReducer from './slices/lentborrowSlice'

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    analytics: analyticsReducer,
    lentBorrow: lentBorrowReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
