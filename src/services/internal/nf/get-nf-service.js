import api from "@/services/config/api";
import { validateToken } from "@/services/common/interceptor-service";
import webErrorHandler from "@/helpers/webErrorHandler";

export default async (nfId) => {
  try {
    await validateToken();

    if (!nfId) {
      throw "O nfId da nota fiscal não foi recebido.";
    }

    const response = await api().get(`get-nf-by-id/${nfId}`);

    return response?.data;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
