import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { encrypt } from "@/helpers/encrypt";

export default async (data) => {
  try {
    const { email, resetPasswordCode, newPassword } = data;

    // Validações dos campos dentro do objeto form
    if (!email || typeof email !== "string") {
      throw new Error("O valor 'email' não é válido.");
    }

    if (!resetPasswordCode || typeof resetPasswordCode !== "string") {
      throw new Error("O valor 'resetPasswordCode' não é válido.");
    }

    if (!newPassword || typeof newPassword !== "string") {
      throw new Error("O valor 'newPassword' não é válido.");
    }

    const encryptedPassword = encrypt(newPassword);

    const response = await api().post("create-new-password", {
      email,
      resetPasswordCode,
      newPassword: encryptedPassword,
    });

    return response.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`REGISTER NEW PASSWORD: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
