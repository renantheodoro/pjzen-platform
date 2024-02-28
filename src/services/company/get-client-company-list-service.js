import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { validateToken } from "@/services/common/interceptor-service";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";

export default async () => {
  try {
    await validateToken();

    const accountancyUid = getAccountancyDataFromLocalStorage().uid;

    if (!accountancyUid) {
      throw Error("UID da contabilidade não foi encontrado.");
    }

    const response = await api().get(
      `get-client-company-list?accountancyUid=${accountancyUid}`
    );

    return response?.data?.data?.clientCompaniesData;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`GET CLIENT COMPANY LIST: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
