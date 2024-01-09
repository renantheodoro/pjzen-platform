import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";

const sendValidationCodeService = async (data) => {
  try {
    const { documentId, email } = data;

    if (!documentId || typeof documentId !== "string") {
      throw new Error("O valor 'documentId' não é válido.");
    }

    if (!email || typeof email !== "string") {
      throw new Error("O valor 'email' não é válido.");
    }

    await api().post("send-validation-code", { documentId, email });
  } catch (error) {
    let errorMessage = error?.response?.data?.message;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`SEND VALIDATION CODE: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};

export default sendValidationCodeService;
