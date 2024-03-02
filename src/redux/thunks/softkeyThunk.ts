import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBaseUrl } from "../../constants/app";
import { Softkey } from "../../models/softkey.modal";
import { getDeviceType } from "../../constants/deviceType";

export const fetchSoftKeys = createAsyncThunk<Softkey[]>(
  "[softkey]/fetchSoftKeys",
  async () => {
    const response = await fetch(
      `${getBaseUrl()}/media/softkeys/${getDeviceType()}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = await response.json();
    return data as Softkey[];
  }
);
