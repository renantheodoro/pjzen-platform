import api from "@/services/config/api";

const registerNewPasswordService = async (data) => {
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

    const response = await api().post("register-new-password", {
      email,
      resetPasswordCode,
      newPassword,
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.message;
    console.error("[REGISTER NEW PASSWORD SERVICE] Message ->", errorMessage);
    throw errorMessage;
  }
};

export default registerNewPasswordService;
