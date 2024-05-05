import api from "@/services/config/api";
import { validateToken } from "@/services/common/interceptor-service";
import webErrorHandler from "@/helpers/webErrorHandler";

export default async (companyUid) => {
  try {
    await validateToken();

    if (!companyUid) {
      throw "O uid da empresa não foi recebido.";
    }

    const response = await api().get(`get-client-company-by-id`, {
      params: {
        companyUid: companyUid,
      },
    });

    return response?.data;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
