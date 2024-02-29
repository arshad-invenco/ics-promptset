import { createSelector } from "@reduxjs/toolkit";
import { FontRootState } from "../../models/fonts";

export const selectFonts = createSelector(
  (state: FontRootState) => state.font.data,
  (data) => data
);
