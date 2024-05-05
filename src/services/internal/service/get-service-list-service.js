import api from "@/services/config/api";
import webErrorHandler from "@/helpers/webErrorHandler";
import { validateToken } from "@/services/common/interceptor-service";

export default async (companyUid) => {
  try {
    await validateToken();

    if (!companyUid) {
      throw "UID do cliente não foi recebido";
    }

    const response = await api().get(`get-client-services/${companyUid}`);

    return response?.data;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
