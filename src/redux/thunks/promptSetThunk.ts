import { createAsyncThunk } from "@reduxjs/toolkit";
import { PromptSetInterface } from "../../models/promptset.modal";
import { getBaseUrl } from "../../constants/app";
import request from "../../services/interceptor";
import { getPromptSetId } from "../../constants/promptSetConstants";

export const fetchPromptSet = createAsyncThunk<PromptSetInterface>(
  "[prompt set]/fetchPromptSet",
  async () => {
    try {
      const response = await request().get(
        `${getBaseUrl()}/media/promptsets/7b6b43c8-080c-4548-8618-362db74e77dd`
      );
      const data = response.data;
      return data as PromptSetInterface;
    } catch (error) {
      throw error;
    }
  }
);
