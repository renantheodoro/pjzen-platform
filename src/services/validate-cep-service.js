import axios from "axios";
import { validateToken } from "@/services/common/interceptor-service";

export default async (zipCode) => {
  try {
    await validateToken();

    const response = await axios.get(
      `https://viacep.com.br/ws/${zipCode}/json/`
    );

    if (response.data.erro) {
      throw new Error(response.data.erro);
    }

    return response.data;
  } catch (error) {
    return { error: error.message || "Ocorreu um erro desconhecido." };
  }
};
