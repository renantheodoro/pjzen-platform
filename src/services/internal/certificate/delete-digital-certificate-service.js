import api from "@/services/config/api";
import webErrorHandler from "@/helpers/webErrorHandler";
import { validateStringField } from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";

export default async (certificateId) => {
  try {
    await validateToken();

    if (!validateStringField("certificateId", certificateId)) {
      throw "Id do certificado inválido.";
    }

    const response = await api().post(`delete-certificate/${certificateId}`);

    return response;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
