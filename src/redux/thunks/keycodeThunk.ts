import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBaseUrl } from "../../constants/app";
import { Keycode } from "../../models/keycode";

export const fetchKeyCodes = createAsyncThunk<Keycode[]>(
  "[keycode]/fetchKeyCodes",
  async () => {
    const response = await fetch(`${getBaseUrl()}/media/keycodes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await response.json();
    return data as Keycode[];
  }
);
