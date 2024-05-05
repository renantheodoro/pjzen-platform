import api from "@/services/config/api";
import { validateToken } from "@/services/common/interceptor-service";
import webErrorHandler from "@/helpers/webErrorHandler";

export default async (nfId) => {
  try {
    await validateToken();

    if (!nfId) {
      throw "O id da nota fiscal não foi recebido.";
    }

    const response = await api().post(`cancel-nf`, {
      nfId,
    });

    return response?.data;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
