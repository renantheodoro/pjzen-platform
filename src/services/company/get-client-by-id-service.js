import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { validateToken } from "@/services/common/interceptor-service";

export default async (clientUid) => {
  try {
    await validateToken();

    if (!clientUid) {
      throw Error("UID do cliente não foi recebido.");
    }

    const response = await api().get(`get-client-by-id?clientUid=${clientUid}`);

    return response?.data?.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`GET CLIENT COMPANY: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
