import { createSelector } from "@reduxjs/toolkit";
import { KeycodeRootState } from "../../models/keycode";

export const selectKeycodes = createSelector(
  (state: KeycodeRootState) => state.keycode.data,
  (data) => data
);

export const selectKeycodeError = createSelector(
  (state: KeycodeRootState) => state.keycode.error,
  (error) => error
);
