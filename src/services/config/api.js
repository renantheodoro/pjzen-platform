import axios from "axios";
import { BASE_CLOUDFUNCTIONS_URL_LOCAL } from "@/data/config/api-config";
import { BASE_CLOUDFUNCTIONS_URL_DEV } from "@/data/config/api-config";
import { isLocalhost } from "@/helpers/environment";

export default () => {
  const baseUrl = isLocalhost()
    ? BASE_CLOUDFUNCTIONS_URL_LOCAL
    : BASE_CLOUDFUNCTIONS_URL_DEV;

  const apiKey = process.env.VUE_APP_FIREBASE_APIKEY;

  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
  });

  return instance;
};
