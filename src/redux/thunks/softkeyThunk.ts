import { createAsyncThunk } from "@reduxjs/toolkit";
import { Softkey } from "../../models/softkey.modal";
import { getBaseUrl } from "../../constants/app";
import { getDeviceType } from "../../constants/deviceType";
import request from "../../services/interceptor";

export const fetchSoftKeys = createAsyncThunk<Softkey[]>(
  "[softkey]/fetchSoftKeys",
  async () => {
    try {
      const response = await request().get(
        `${getBaseUrl()}/media/softkeys/${getDeviceType()}`
      );
      const data = response.data;
      return data as Softkey[];
    } catch (error) {
      throw error;
    }
  }
);
