import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectToasts = createSelector(
  (state: RootState) => state.toasts.toasts,
  (toasts) => toasts
);
