import { createSelector } from "@reduxjs/toolkit";
import { TouchMaskRootState } from "../../models/touchMask.modal";

export const selectTouchMasks = createSelector(
  (state: TouchMaskRootState) => state.touchmask.data,
  (data) => data
);
