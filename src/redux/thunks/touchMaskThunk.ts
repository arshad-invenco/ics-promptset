import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBaseUrl } from "../../constants/app";
import { TouchMaskResponse } from "../../models/touchMask.modal";

export const fetchTouchMasks = createAsyncThunk<TouchMaskResponse>(
  "[touchmask]/fetchTouchMasks",
  async () => {
    const response = await fetch(`${getBaseUrl()}/media/touchmaps`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await response.json();
    return data as TouchMaskResponse;
  }
);
