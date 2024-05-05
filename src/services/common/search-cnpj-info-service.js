import axios from "axios";

export default async function searchCNPJInfo(cnpjParam) {
  const cnpj = cnpjParam
    .replaceAll(".", "")
    .replaceAll("/", "")
    .replaceAll("-", "");

  const receitaUrl = `https://api-publica.speedio.com.br/buscarcnpj?cnpj=${cnpj}`;

  try {
    const response = await axios.get(receitaUrl);

    return response;
  } catch (error) {
    return { error };
  }
}
