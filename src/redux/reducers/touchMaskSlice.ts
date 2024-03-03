import { createSlice } from "@reduxjs/toolkit";
import { TouchMaskResponse } from "../../models/touchMask.modal";
import { fetchTouchMasks } from "../thunks/touchMaskThunk";

interface TouchMaskState {
  data: TouchMaskResponse;
  loading: boolean;
  error: string;
}

export const initialState: TouchMaskState = {
  data: {
    resultsMetadata: {
      totalResults: 0,
      pageIndex: 0,
      pageSize: 100,
    },
    results: [],
  },
  loading: false,
  error: "",
};

export const touchMaskSlice = createSlice({
  name: "touchMask",
  initialState,
  reducers: {
    setTouchMaskData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTouchMasks.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchTouchMasks.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchTouchMasks.rejected, (state) => {
      state.loading = false;
      state.error = "";
    });
  },
});

export const { setTouchMaskData } = touchMaskSlice.actions;
export default touchMaskSlice.reducer;



