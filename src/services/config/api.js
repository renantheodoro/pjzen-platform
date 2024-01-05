import axios from "axios";
import { BASE_CLOUDFUNCTIONS_URL_LOCAL } from "@/data/config/api-config";
import { BASE_CLOUDFUNCTIONS_URL_DEV } from "@/data/config/api-config";

export default () => {
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const baseUrl = isLocalhost
    ? BASE_CLOUDFUNCTIONS_URL_LOCAL
    : BASE_CLOUDFUNCTIONS_URL_DEV;

  //   const apiKey = process.env.VUE_APP_FIREBASE_APIKEY;

  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      //   Authorization: apiKey,
    },
  });

  return instance;
};
