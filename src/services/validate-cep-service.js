import axios from "axios";

import { verifyToken } from "@/services/common/interceptor-service";

export default async (zipCode) => {
  try {
    const isSessionValid = await verifyToken();

    if (!isSessionValid) {
      throw Error("Token inválido");
    }

    const response = await axios.get(
      `https://viacep.com.br/ws/${zipCode}/json/`
    );

    if (response.error) {
      return { error: response.error };
    }

    return response;
  } catch (error) {
    return { error };
  }
};
