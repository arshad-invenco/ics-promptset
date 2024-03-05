import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getBaseUrl } from "../constants/app";

const request = () => {
  const instance = axios.create({
    validateStatus(status) {
      return status === 413 || (status >= 200 && status < 300);
    },
  });

  instance.interceptors.request.use(
    (config: AxiosRequestConfig) =>
      new Promise((resolve, reject) => {
        const apiFromLocalStorage = localStorage.getItem("api");
        const isLocal = window.location.host.includes("localhost");

        const tokenFromLocalStorage = localStorage.getItem("token");

        if (!tokenFromLocalStorage && !isLocal && apiFromLocalStorage) {
          reject(new Error("Cannot find token in the localStorage"));
        }

        const commonHeaders = config.headers?.common ?? {};
        const newConfig = {
          ...config,
          baseURL: `${getBaseUrl()}`,
          headers: {
            ...commonHeaders,
            Authorization: `Bearer ${tokenFromLocalStorage}`,
          },
        };
        resolve(newConfig);
      })
  );

  instance.interceptors.response.use(
    (response) => {
      if (
        response.headers["refresh-token"] &&
        !localStorage.getItem("enableKeycloak")
      ) {
        localStorage.setItem("token", response.headers["refresh-token"]);
      }
      return response;
    },
    (error: AxiosError) => {
      const response: AxiosResponse<any, any> | undefined = error?.response;
      if (response?.status === 413) {
        // Max size of the request is 5mb.
        return Promise.reject(new Error("The size of your input is too big."));
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default request;
