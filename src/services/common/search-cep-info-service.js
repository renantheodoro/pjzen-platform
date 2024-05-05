import axios from "axios";
import { validateToken } from "@/services/common/interceptor-service";
const errorMessage =
  "O serviço de busca de CEP não está respondendo. Tente adicionar os dados manualmente.";

export default async function searchCepInfoService(zipcode) {
  try {
    await validateToken();

    const response = await axios.get(
      `https://viacep.com.br/ws/${zipcode}/json/`
    );

    // Verificar se o CEP é válido
    const addressData = response.data;

    if (addressData.erro) {
      throw errorMessage;
    }

    return addressData;
  } catch (error) {
    console.error("Falha ao buscar dados do CEP: ", error);
    throw errorMessage;
  }
}
