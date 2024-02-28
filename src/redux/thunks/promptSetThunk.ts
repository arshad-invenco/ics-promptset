import { createAsyncThunk } from "@reduxjs/toolkit";
import { PromptSetInterface } from "../../models/promptset.modal";
import { getBaseUrl } from "../../constants/app";

export const fetchPromptSet = createAsyncThunk<PromptSetInterface>(
  "[prompt set]/fetchPromptSet",
  async () => {
    const response = await fetch(
      `${getBaseUrl()}/media/promptsets/4e1132da-18f8-4fc0-8645-a1e8d9e3a275`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = await response.json();
    return data as PromptSetInterface;
  }
);
