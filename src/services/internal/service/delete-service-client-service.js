import api from "@/services/config/api";
import webErrorHandler from "@/helpers/webErrorHandler";
import { validateStringField } from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";

export default async (serviceId) => {
  try {
    await validateToken();

    if (!validateStringField("serviceId", serviceId)) {
      throw "Id do serviço inválido.";
    }

    const response = await api().post(`delete-client-service/${serviceId}`);

    return response;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
