import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { getTokenFromSessionStorage } from "@/helpers/session-storage";
import { setTokenToSessionStorage } from "@/helpers/session-storage";
import {
  setAccountancyDataToLocalStorage,
  setProfileDataToLocalStorage,
  setUserSessionStorage,
} from "@/helpers/local-storage";
import router from "@/router";

const logout = () => {
  setTokenToSessionStorage("");
  setAccountancyDataToLocalStorage("");
  setProfileDataToLocalStorage("");
  setUserSessionStorage("");
  router.push({ name: "login", query: { expiredSession: true } });
};

const verifyToken = async () => {
  try {
    const accessToken = getTokenFromSessionStorage();

    if (!accessToken) {
      logout();
      throw "Token inválido";
    }

    const response = await api().post("verify-token", { token: accessToken });

    return response?.data?.data?.token !== null;
  } catch (error) {
    const errorMessage =
      error?.response?.data || "Ocorreu um erro desconhecido.";
    errorLog(`VERIFY TOKEN ERROR: ${errorMessage} - ${error}`);
    logout();
    return false;
  }
};

const validateToken = async () => {
  try {
    await verifyToken();
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Ocorreu um erro desconhecido.";
    errorLog(`VALIDATE TOKEN ERROR: ${errorMessage} - ${error}`);
    logout();
    return false;
  }
};

export { verifyToken, validateToken };
