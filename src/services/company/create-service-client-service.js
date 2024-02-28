import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { validateStringField } from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";

export default async (data) => {
  try {
    await validateToken();

    const accountancyUid = getAccountancyDataFromLocalStorage().uid;

    if (!accountancyUid) {
      throw Error("UID da contabilidade não foi encontrado.");
    }

    const {
      clientUid,
      serviceName,
      internalCode,
      type,
      sellingValue,
      cnae,
      coastValue,
      municipalServiceCode,
      complementaryLawCode,
      operationNature,
    } = data;

    if (
      !validateStringField("serviceName", serviceName) ||
      !validateStringField("internalCode", internalCode) ||
      !validateStringField("type", type) ||
      !validateStringField("sellingValue", sellingValue) ||
      !validateStringField("cnae", cnae) ||
      !validateStringField("coastValue", coastValue) ||
      !validateStringField("municipalServiceCode", municipalServiceCode) ||
      !validateStringField("complementaryLawCode", complementaryLawCode) ||
      !validateStringField("operationNature", operationNature)
    ) {
      throw Error("Erro de validação dos campos. Verifique e tente novamente.");
    }

    const serviceData = {
      clientUid,
      serviceName,
      internalCode,
      type,
      sellingValue,
      cnae,
      coastValue,
      municipalServiceCode,
      complementaryLawCode,
      operationNature,
    };

    const response = await api().post("create-client-service", serviceData);

    return response;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`CREATE CLIENT SERVICE: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
