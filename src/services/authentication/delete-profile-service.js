import api from "@/services/config/api";
import webErrorHandler from "@/helpers/webErrorHandler";
import { validateStringField } from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";

export default async (profileUid) => {
  try {
    await validateToken();

    if (!validateStringField("profileUid", profileUid)) {
      throw "Id do perfil inválido.";
    }

    const response = await api().post(`delete-profile/${profileUid}`);

    return response;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
