import { createSelector } from "@reduxjs/toolkit";
import { SoftkeyRootState } from "../../models/softkey";

export const selectSoftKeys = createSelector(
  (state: SoftkeyRootState) => state.softkey.data,
  (data) => data
);

