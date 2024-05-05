import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { validateToken } from "@/services/common/interceptor-service";
import { validateStringField } from "@/helpers/validate-fields";

export default async (companyUid) => {
  try {
    await validateToken();

    if (!validateStringField("companyUid", companyUid)) {
      throw "CNPJ da empresa não recebido.";
    }
    const response = await api().get(`get-nf-list`, {
      params: {
        companyUid,
      },
    });

    return response?.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`GET NF LIST LIST: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
