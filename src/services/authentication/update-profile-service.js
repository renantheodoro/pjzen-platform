import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";

export default async (data) => {
  try {
    const { profileUid, newPermission } = data;

    // Validações dos campos dentro do objeto form
    if (!profileUid || typeof profileUid !== "string") {
      throw "O valor 'profileUid' não é válido.";
    }

    if (!newPermission || typeof newPermission !== "string") {
      throw "O valor 'newPermission' não é válido.";
    }

    const response = await api().post("update-profile-account", {
      newPermission,
      profileUid,
    });

    return response.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`UPDATE PROFILE ACCOUNT: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
