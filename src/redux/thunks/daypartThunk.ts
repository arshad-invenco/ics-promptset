import { createAsyncThunk } from "@reduxjs/toolkit";
import { DayPart } from "../../models/daypart.modal";

export const fetchDayPart = createAsyncThunk<DayPart[]>(
  "[daypart]/fetchDayPart",
  async () => {
    const response = await fetch("http://localhost:3001/dayparts");
    const data = await response.json();
    return data as DayPart[];
  }
);
