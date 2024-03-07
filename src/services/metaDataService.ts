import { getBaseUrl } from "../constants/app";
import request from "./interceptor";

const isSaving = false;

export function getIsSaving(): boolean {
  return false;
}

export async function getOdmlData(id: string): Promise<string> {
  try {
    const response = await request().post(
      `${getBaseUrl()}/media/prompt/${id}/toODML?beautify=${true}`,
      []
    );
    return response.data;
  } catch (error) {
    return "";
  }
}
