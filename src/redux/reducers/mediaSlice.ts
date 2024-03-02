import { createSlice } from "@reduxjs/toolkit";
import { AssetResponse } from "../../models/media.modal";
import { fetchAssets } from "../thunks/mediaThunk";

interface AssetState {
  data: AssetResponse;
  loading: boolean;
  error: string;
}

export const initialState: AssetState = {
  data: {
    resultsMetadata: {
      totalResults: 0,
      pageIndex: 0,
      pageSize: 20,
    },
    results: [],
  },
  loading: false,
  error: "",
};

export const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    setAssetData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAssets.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchAssets.fulfilled, (state, action) => {
      const { payload, meta } = action;
      const { replace } = meta.arg;
      if (replace) {
        state.data = payload;
      } else {
        if (payload?.results) {
          const uniqueResults = payload.results.filter(
            (newAsset) =>
              !state.data.results.some(
                (existingAsset) => existingAsset.id === newAsset.id
              )
          );

          state.data.results = [...state.data.results, ...uniqueResults];
          state.data.resultsMetadata = payload.resultsMetadata;
        }
      }
      state.loading = false;
      state.error = "";
    });
    builder.addCase(fetchAssets.rejected, (state) => {
      state.loading = false;
      state.error = "Failed to fetch assets";
    });
  },
});

export const { setAssetData } = assetSlice.actions;
export default assetSlice.reducer;
