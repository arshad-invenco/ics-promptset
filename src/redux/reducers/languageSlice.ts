import { createSlice } from "@reduxjs/toolkit";
import { Language } from "../../models/language.modal";
import { fetchLanguages } from "../thunks/languageThunk";

interface LanguageState {
  data: Language[];
  isLoading: boolean;
  error: string;
}

const initialState: LanguageState = {
  data: [],
  isLoading: true,
  error: "",
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguageData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLanguages.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(fetchLanguages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchLanguages.rejected, (state) => {
      state.isLoading = false;
      state.error = "Failed to fetch languages";
    });
  },
});

export const { setLanguageData } = languageSlice.actions;
export default languageSlice.reducer;

