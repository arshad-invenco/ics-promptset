import { createAsyncThunk } from "@reduxjs/toolkit";
import { DayPart } from "../../models/daypart.modal";
import { getBaseUrl } from "../../constants/app";
import request from "../../services/interceptor";

export const fetchDayPart = createAsyncThunk<DayPart[]>(
  "[daypart]/fetchDayPart",
  async () => {
    const response = await request().get(`${getBaseUrl()}/media/dayparts`);
    const data = response.data;
    return data as DayPart[];
  }
);
