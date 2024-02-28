import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { getTokenFromSessionStorage } from "@/helpers/session-storage";

const verifyToken = async () => {
  try {
    const accessToken = getTokenFromSessionStorage();

    if (!accessToken) {
      throw new Error("Token inválido");
    }

    const response = await api().post("verify-token", { token: accessToken });
    return !!response?.data?.data?.token;
  } catch (error) {
    const errorMessage =
      error?.response?.data || "Ocorreu um erro desconhecido.";
    errorLog(`INTERCEPTOR SERVICE: ${errorMessage} - ${error}`);
    return false;
  }
};

const validateToken = async () => {
  try {
    const isSessionValid = await verifyToken();
    if (!isSessionValid) {
      throw new Error("Token inválido");
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Ocorreu um erro desconhecido.";
    errorLog(`INTERCEPTOR SERVICE: ${errorMessage} - ${error}`);
    return false;
  }
};

export { verifyToken, validateToken };
