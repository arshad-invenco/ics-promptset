import { createSelector } from "@reduxjs/toolkit";
import { LanguageRootState } from "../../models/language.modal";

export const selectLanguages = createSelector(
  (state: LanguageRootState) => state.language.data,
  (data) => data
);
