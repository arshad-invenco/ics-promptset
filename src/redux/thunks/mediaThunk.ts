import { createAsyncThunk } from "@reduxjs/toolkit";
import { AssetParams, AssetResponse } from "../../models/media.modal";
import { getBaseUrl } from "../../constants/app";
import request from "../../services/interceptor";

export const fetchAssets = createAsyncThunk<
  AssetResponse,
  { queryParams: AssetParams; replace: boolean }
>("[assets]/fetchAssets", async ({ queryParams, replace }) => {
  try {
    const response = await request().get(`${getBaseUrl()}/media/assets`, {
      params: queryParams,
    });
    const data = response.data;
    return data as AssetResponse;
  } catch (error) {
    throw error;
  }
});
