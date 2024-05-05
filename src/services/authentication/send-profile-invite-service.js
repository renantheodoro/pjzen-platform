import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";
import { validateToken } from "@/services/common/interceptor-service";

export default async (data) => {
  try {
    await validateToken();

    const accountancyData = getAccountancyDataFromLocalStorage();

    if (!accountancyData) {
      throw "Dados da contabilidade não foram encontrado.";
    }

    const { email, permission } = data;

    // Validações dos campos dentro do objeto form
    if (!email || typeof email !== "string") {
      throw "O valor 'email' não é válido.";
    }

    if (!permission || typeof permission !== "string") {
      throw "O valor 'permission' não é válido.";
    }

    const response = await api().post("send-profile-invite", {
      email,
      permission,
      accountancyUid: accountancyData.uid,
      accountancyName: accountancyData.company,
    });

    return response.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`SEND PROILE INVITE EMAIL: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
