import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBaseUrl } from "../../constants/app";
import { Language } from "../../models/language.modal";
import { getCompanyId } from "../../constants/language";

export const fetchLanguages = createAsyncThunk<Language[]>(
  "[language]/fetchLanguages",
  async () => {
    const response = await fetch(
      `${getBaseUrl()}/companies/${getCompanyId()}/languages`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = await response.json();
    return data as Language[];
  }
);
