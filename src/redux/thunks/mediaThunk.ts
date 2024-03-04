import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBaseUrl } from "../../constants/app";
import { AssetParams, AssetResponse } from "../../models/media.modal";

export const fetchAssets = createAsyncThunk<
  AssetResponse,
  { queryParams: AssetParams; replace: boolean }
>("[assets]/fetchAssets", async ({ queryParams, replace }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const response = await fetch(`${getBaseUrl()}/media/assets?${queryString}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const data = await response.json();
  return data as AssetResponse;
});
