import { createSlice } from "@reduxjs/toolkit";
import { DayPart } from "../../models/daypart.modal";
import { fetchDayPart } from "../thunks/daypartThunk";

interface DayPartState {
  data: DayPart[];
  isLoading: boolean;
  error: string;
}

const initialState: DayPartState = {
  data: [],
  isLoading: true,
  error: "",
};

export const daypartSlice = createSlice({
  name: "dayPart",
  initialState,
  reducers: {
    setDayPartData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDayPart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchDayPart.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(fetchDayPart.rejected, (state) => {
      state.isLoading = false;
      state.error = "Failed to fetch daypart";
    });
  },
});

export const { setDayPartData } = daypartSlice.actions;
export default daypartSlice.reducer;
