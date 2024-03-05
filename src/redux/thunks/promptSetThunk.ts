import { createAsyncThunk } from "@reduxjs/toolkit";
import { PromptSetInterface } from "../../models/promptset.modal";
import { getBaseUrl } from "../../constants/app";

export const fetchPromptSet = createAsyncThunk<PromptSetInterface>(
  "[prompt set]/fetchPromptSet",
  async () => {
    const response = await fetch(
      `${getBaseUrl()}/media/promptsets/87783e97-7467-4373-8535-6d6a1efda281`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = await response.json();
    return data as PromptSetInterface;
  }
);
