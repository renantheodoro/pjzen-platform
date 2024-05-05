import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { validateToken } from "@/services/common/interceptor-service";

export default async (profileUid) => {
  try {
    await validateToken();

    if (!profileUid) {
      throw "UID do profile inválido.";
    }
    const response = await api().get(`get-profile`, {
      params: {
        profileUid,
      },
    });

    return response?.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`GET PROFILE: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
