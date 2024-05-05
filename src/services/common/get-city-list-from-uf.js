import axios from "axios";

export default async function getCityListFromUf(uf) {
  try {
    const response = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    );
    const municipios = response.data;
    return municipios;
  } catch (error) {
    console.error();
    throw `[API IBGE RESPONSE] Ocorreu um erro ao buscar o código da cidade:" ${error}`;
  }
}
