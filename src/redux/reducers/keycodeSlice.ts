import { createSlice } from "@reduxjs/toolkit";
import { Keycode } from "../../models/keycode";
import { fetchKeyCodes } from "../thunks/keycodeThunk";

interface KeycodeState {
  data: Keycode[];
  isLoading: boolean;
  error: string;
}

const initialState: KeycodeState = {
  data: [],
  isLoading: true,
  error: "",
};

export const keycodeSlice = createSlice({
  name: "keycode",
  initialState,
  reducers: {
    setKeyCodeData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchKeyCodes.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(fetchKeyCodes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchKeyCodes.rejected, (state) => {
      state.isLoading = false;
      state.error = "Failed to fetch keycodes";
    });
  },
});

export const { setKeyCodeData } = keycodeSlice.actions;
export default keycodeSlice.reducer;
