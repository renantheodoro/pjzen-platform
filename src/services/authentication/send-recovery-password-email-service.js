import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";

export default async (data) => {
  try {
    const { email } = data;

    // Validações dos campos dentro do objeto form
    if (!email || typeof email !== "string") {
      throw new Error("O valor 'email' não é válido.");
    }

    const response = await api().post("send-recovery-password-email", {
      email,
    });

    return response.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`SEND RECOVERY PASSWORD EMAIL: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
