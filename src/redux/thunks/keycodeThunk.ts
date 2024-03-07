import { createAsyncThunk } from "@reduxjs/toolkit";
import { Keycode } from "../../models/keycode.modal";
import { getBaseUrl } from "../../constants/app";
import request from "../../services/interceptor";

export const fetchKeyCodes = createAsyncThunk<Keycode[]>(
  "[keycode]/fetchKeyCodes",
  async () => {
    const response = await request().get(`${getBaseUrl()}/media/keycodes`);
    const data = response.data;
    return data as Keycode[];
  }
);
