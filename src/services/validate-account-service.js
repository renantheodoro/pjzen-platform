import api from "@/services/config/api";

const validateAccount = async (data) => {
  try {
    const { uid, validationCode } = data;

    // Validações dos campos dentro do objeto form
    if (!uid || typeof uid !== "string") {
      throw new Error("O valor 'uid' não é válido.");
    }

    if (!validationCode || isNaN(Number(validationCode))) {
      throw new Error("O valor 'validationCode' não é válido.");
    }

    const response = await api().post("validate-account", {
      uid,
      validationCode,
    });

    console.log("validateAccountResponse", response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("[VERIFY EMAIL SERVICE] Message ->", errorMessage);
    throw errorMessage;
  }
};

export default validateAccount;
