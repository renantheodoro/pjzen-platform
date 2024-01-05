import api from "@/services/config/api";

const sendRecoveryPasswordEmail = async (data) => {
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
    const errorMessage = error.message;
    console.error("[SEND RECOVERY PASSWORD EMAIL] Message ->", errorMessage);
    throw errorMessage;
  }
};

export default sendRecoveryPasswordEmail;
