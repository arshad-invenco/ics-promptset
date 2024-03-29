import { createAsyncThunk } from "@reduxjs/toolkit";
import { PromptSetInterface } from "../../models/promptset.modal";
import { getBaseUrl } from "../../constants/app";
import request from "../../services/interceptor";

export const fetchPromptSet = createAsyncThunk<PromptSetInterface, string>(
  "[prompt set]/fetchPromptSet",
  async (id: string) => {
    const response = await request().get(
      `${getBaseUrl()}/media/promptsets/${id}`
    );
    const data = response.data;
    return data as PromptSetInterface;
  }
);
