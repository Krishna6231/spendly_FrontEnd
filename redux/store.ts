import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './slices/expenseSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    analytics: analyticsReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
