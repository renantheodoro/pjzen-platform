import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { getTokenFromSessionStorage } from "@/helpers/session-storage";

export const verifyToken = async () => {
  try {
    const accessToken = getTokenFromSessionStorage();

    if (!accessToken) {
      throw Error("Token inválido");
    }

    const response = await api().post("verify-token", { token: accessToken });

    if (response?.data?.data?.token) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    let errorMessage = error?.response?.data?.message;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`INTERCEPTOR SERVICE: ${errorMessage} - ${error}`);
    return false;
  }
};
