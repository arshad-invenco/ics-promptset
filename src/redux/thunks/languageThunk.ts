import { createAsyncThunk } from "@reduxjs/toolkit";
import { Language } from "../../models/language.modal";
import { getBaseUrl } from "../../constants/app";
import { getCompanyId } from "../../constants/language";
import request from "../../services/interceptor";

export const fetchLanguages = createAsyncThunk<Language[]>(
  "[language]/fetchLanguages",
  async () => {
    try {
      const response = await request().get(`${getBaseUrl()}/companies/${getCompanyId()}/languages`);
      const data = response.data;
      return data as Language[];
    } catch (error) {
      throw error;
    }
  }
);
