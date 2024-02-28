import { createAsyncThunk } from "@reduxjs/toolkit";
import { DayPart } from "../../models/daypart.modal";
import { getBaseUrl } from "../../constants/app";

export const fetchDayPart = createAsyncThunk<DayPart[]>(
  "[daypart]/fetchDayPart",
  async () => {
    const response = await fetch(`${getBaseUrl()}/media/dayparts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await response.json();
    return data as DayPart[];
  }
);
