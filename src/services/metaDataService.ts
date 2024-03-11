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

export function fileSize(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  return `${Number((size / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
