import { createSelector } from "@reduxjs/toolkit";
import { FontRootState } from "../../models/fonts.modal";

export const selectFonts = createSelector(
  (state: FontRootState) => state.font.data,
  (data) => data
);
