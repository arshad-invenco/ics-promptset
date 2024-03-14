export const API = "api";
export const getBaseUrl = () => localStorage.getItem(API) + "/v1";

export const getPromptSetUrl = (
  id: string,
  queryParams?: Record<string, string>
) => {
  const origin = window.location.origin;
  let url = `${origin}/media/promptsets/${id}`;
  if (queryParams) {
    const queryString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    url += `?${queryString}`;
  }
  return url;
};
