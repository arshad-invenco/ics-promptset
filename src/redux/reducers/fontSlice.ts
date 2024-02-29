import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Font } from "../../models/fonts";
import { fetchFonts } from "../thunks/fontThunk";

interface FontState {
  data: Font[];
  isLoading: boolean;
  error: string;
}

const initialState: FontState = {
  data: [],
  isLoading: true,
  error: "",
};

export const fontSlice = createSlice({
  name: "font",
  initialState,
  reducers: {
    setFontData: (state, action: PayloadAction<Font[]>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFonts.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(fetchFonts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchFonts.rejected, (state) => {
      state.isLoading = false;
      state.error = "Failed to fetch fonts";
    });
  },
});

export const { setFontData } = fontSlice.actions;
export default fontSlice.reducer;
