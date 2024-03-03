import { createSelector } from "@reduxjs/toolkit";
import { AssetRootState } from "../../models/media.modal";

export const selectAssets = createSelector(
  (state: AssetRootState) => {
    return state.asset.data;
  },
  (asset) => asset
);

export const selectAssetLoading = createSelector(
  (state: AssetRootState) => {
    return state.asset.loading;
  },
  (loading) => loading
);
