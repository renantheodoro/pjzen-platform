import api from "@/services/config/api";
import webErrorHandler from "@/helpers/webErrorHandler";
import { validateStringField } from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";

export default async (companyUid) => {
  try {
    await validateToken();

    const accountancyUid = getAccountancyDataFromLocalStorage()?.uid;

    if (!accountancyUid) {
      throw "UID da contabilidade não foi encontrado.";
    }

    if (!validateStringField("companyUid", companyUid)) {
      throw "companyUid não recebido.";
    }

    const response = await api().get(
      `search-certificates-about-expire/${companyUid}`
    );

    return response.data;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
