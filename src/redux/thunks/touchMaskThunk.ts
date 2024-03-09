import { createAsyncThunk } from "@reduxjs/toolkit";
import { TouchMaskResponse } from "../../models/touchMask.modal";
import { getBaseUrl } from "../../constants/app";
import request from "../../services/interceptor";

export const fetchTouchMasks = createAsyncThunk<TouchMaskResponse>(
  "[touchmask]/fetchTouchMasks",
  async () => {
    const response = await request().get(`${getBaseUrl()}/media/touchmaps`);
    const data = response.data;
    return data as TouchMaskResponse;
  }
);
