import { createSlice } from "@reduxjs/toolkit";
import { DayPart } from "../../models/daypart.modal";
import { fetchDayPart } from "../thunks/daypartThunk";

interface DayPartState {
  data: DayPart[];
  isLoading: boolean;
  error: boolean;
}

const initialState: DayPartState = {
  data: [],
  isLoading: true,
  error: false,
};

export const daypartSlice = createSlice({
  name: "dayPart",
  initialState,
  reducers: {
    setDayPartData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDayPart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = false;
    });
    builder.addCase(fetchDayPart.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchDayPart.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });
  },
});

export const { setDayPartData } = daypartSlice.actions;
export default daypartSlice.reducer;
