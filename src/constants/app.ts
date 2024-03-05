export const getBaseUrl = () => "https://api-gin.invencocloud.com/rest/v1";

export const getPromptSetUrl = (id: string, queryParams?: Record<string, string>) => {
    let url = `https://gin.invencocloud.com/media/promptsets/${id}`;
    if (queryParams) {
        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");
        url += `?${queryString}`;
    }
    return url;
};
