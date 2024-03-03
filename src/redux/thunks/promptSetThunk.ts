import { createAsyncThunk } from "@reduxjs/toolkit";
import { PromptSetInterface } from "../../models/promptset.modal";
import { getBaseUrl } from "../../constants/app";

export const fetchPromptSet = createAsyncThunk<PromptSetInterface>(
  "[prompt set]/fetchPromptSet",
  async () => {
    const response = await fetch(
      `${getBaseUrl()}/media/promptsets/7b6b43c8-080c-4548-8618-362db74e77dd`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
        // 'http://localhost:3001/promptSetData'
    );
    const data = await response.json();
    return data as PromptSetInterface;
  }
);
