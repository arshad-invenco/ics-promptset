import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getBaseUrl } from "../constants/app";
import { addToasts } from "../redux/reducers/toastSlice";
import { ErrorResponse } from "react-router-dom";

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
      const store = require("../redux/store").default;
      const errorMessage = (error?.response?.data as any)?.message;
      store.dispatch(addToasts({ message: errorMessage ?? error.message }));
      return Promise.reject(error);
    }
  );

  return instance;
};

export default request;
