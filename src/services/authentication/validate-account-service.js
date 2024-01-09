import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";

const validateAccountService = async (data) => {
  try {
    const { documentId, validationCode } = data;

    // Validações dos campos dentro do objeto form
    if (!documentId || typeof documentId !== "string") {
      throw new Error("O valor 'documentId' não é válido.");
    }

    if (!validationCode || isNaN(Number(validationCode))) {
      throw new Error("O valor 'validationCode' não é válido.");
    }

    await api().post("validate-account", {
      documentId,
      validationCode,
    });
  } catch (error) {
    let errorMessage = error?.response?.data?.message;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`VERIFY EMAIL: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};

export default validateAccountService;
