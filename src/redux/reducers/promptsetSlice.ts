import { createSlice } from "@reduxjs/toolkit";
import { fetchPromptSet } from "../thunks/promptSetThunk";
import { PromptSetInterface } from "../../models/promptset.modal";

export interface PromptSetState {
  data: PromptSetInterface;
  isLoading: boolean;
  error: boolean;
}

const initialState: PromptSetState = {
  data: {} as PromptSetInterface,
  isLoading: true,
  error: false,
};

export const promptsetSlice = createSlice({
  name: "promptSet",
  initialState,
  reducers: {
    setPromptSetData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPromptSet.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = false;
    });
    builder.addCase(fetchPromptSet.pending, (state, action) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchPromptSet.rejected, (state, action) => {
      state.isLoading = false;
      state.error = true;
    });
  },
});

export const { setPromptSetData } = promptsetSlice.actions;
export default promptsetSlice.reducer;
