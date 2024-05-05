import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { validateToken } from "@/services/common/interceptor-service";

export default async (accountancyUid) => {
  try {
    await validateToken();

    if (!accountancyUid) {
      throw "UID da contabilidade inválido.";
    }
    const response = await api().get(`get-client-accountancy-by-uid`, {
      params: {
        accountancyUid,
      },
    });

    return response?.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`GET ACCOUNTANCY: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
