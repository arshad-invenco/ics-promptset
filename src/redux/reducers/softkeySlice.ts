import { createSlice } from "@reduxjs/toolkit";
import { Softkey } from "../../models/softkey";
import { fetchSoftKeys } from "../thunks/softkeyThunk";

interface SoftkeyState {
  data: Softkey[];
  isLoading: boolean;
  error: string;
}

const initialState: SoftkeyState = {
  data: [],
  isLoading: true,
  error: "",
};

export const softkeySlice = createSlice({
  name: "softkey",
  initialState,
  reducers: {
    setSoftKeyData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = " ";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSoftKeys.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(fetchSoftKeys.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchSoftKeys.rejected, (state) => {
      state.isLoading = false;
      state.error = "Failed to fetch softkeys";
    });
  },
});

export const { setSoftKeyData } = softkeySlice.actions;
export default softkeySlice.reducer;
