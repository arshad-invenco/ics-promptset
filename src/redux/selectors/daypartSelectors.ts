import { createSelector } from "@reduxjs/toolkit";
import { DayPartRootState } from "../../models/daypart.modal";

export const selectDayPart = createSelector(
  (state: DayPartRootState) => state.daypart.data,
  (data) => data
);
