import api from "@/services/config/api";

const sendValidationCode = async (data) => {
  try {
    const { uid, email } = data;

    // Validações dos campos dentro do objeto form
    if (!uid || typeof uid !== "string") {
      throw new Error("O valor 'uid' não é válido.");
    }

    if (!email || typeof email !== "string") {
      throw new Error("O valor 'email' não é válido.");
    }

    const response = await api().post("send-validation-code", { uid, email });

    console.log("sendValidationCodeResponse", response.data);
  } catch (error) {
    const errorMessage = error.message;
    console.error("[SEND VALIDATION CODE SERVICE] Message ->", errorMessage);
    throw errorMessage;
  }
};

export default sendValidationCode;
