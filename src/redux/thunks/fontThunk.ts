import { createAsyncThunk } from "@reduxjs/toolkit";
import { Font } from "../../models/fonts.modal";
import { getBaseUrl } from "../../constants/app";
import { DEFAULT_FONTS } from "../../constants/fontConstant";
import request from "../../services/interceptor";

export const fetchFonts = createAsyncThunk<Font[]>(
  "[font]/fetchFonts",
  async () => {
    const queryParams = new URLSearchParams({
      active: "BOTH",
      order: "uploaded",
      pageIndex: "0",
      pageSize: "10000",
      type: "FONT",
    });

    // Use the Axios instance returned by the request function
    const response = await request().get(`${getBaseUrl()}/media/assets`, {
      params: queryParams,
    });

    const fontFromAssets = response.data.results;

    const allFonts: Font[] = [
      ...DEFAULT_FONTS,
      ...fontFromAssets.map((font: any) => ({
        fontId: document.querySelector("html")?.classList.contains("ie")
          ? font.id.slice(0, 6)
          : font.id,
        name: font.properties.face,
        assetName: font.name,
        family: font.id,
        type: "CUSTOM",
        supportedDevices: ["G7-100", "G6-300", "G6-400", "G6-200"],
        sourceUrl: font.sourceUrl,
        active: font.active,
        fileSize: font.size,
        mimeType: font.properties.mimeType,
      })),
    ];

    return allFonts;
  }
);
