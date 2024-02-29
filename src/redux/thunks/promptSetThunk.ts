import { createAsyncThunk } from "@reduxjs/toolkit";
import { PromptSetInterface } from "../../models/promptset.modal";
import { getBaseUrl } from "../../constants/app";

export const fetchPromptSet = createAsyncThunk<PromptSetInterface>(
  "[prompt set]/fetchPromptSet",
  async () => {
    const response = await fetch(
      `${getBaseUrl()}/media/promptsets/0c414d75-657c-431f-955d-950b3eef0d4f`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = await response.json();
    return data as PromptSetInterface;
  }
);
