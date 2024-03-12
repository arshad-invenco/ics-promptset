// toastsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Toasts } from "../../models/toast.modal";

interface ToastsState {
  toasts: Toasts[];
}

const initialState: ToastsState = {
  toasts: [],
};

export const toastsSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    addToasts: (state, action: PayloadAction<Toasts>) => {
      const toastExistIndex = state.toasts.findIndex(
        (existingToast) => existingToast.message === action.payload.message
      );

      if (toastExistIndex === -1) {
        state.toasts.push(action.payload);
      } else {
        const existingToast = state.toasts[toastExistIndex];
        if (existingToast.count) {
          state.toasts[toastExistIndex] = {
            ...existingToast,
            count: existingToast.count + 1,
          };
        }
      }
    },
    removeToast: (state, action: PayloadAction<Toasts>) => {
      state.toasts = state.toasts.filter((toast) => {
        return toast.message !== action.payload.message;
      });
    },

    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToasts, removeToast, clearToasts } = toastsSlice.actions;

export default toastsSlice.reducer;
