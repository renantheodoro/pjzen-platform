const axios = require("axios");

async function getCityCode(city) {
  try {
    const response = await axios.get(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
    );
    const municipios = response.data;

    for (const municipio of municipios) {
      if (municipio.nome.toLowerCase() === city.toLowerCase()) {
        return municipio.id;
      }
    }

    throw "[API IBGE RESPONSE] Código da cidade não encontrada.";
  } catch (error) {
    console.error();
    throw (
      ("[API IBGE RESPONSE] Ocorreu um erro ao buscar o código da cidade:",
      error)
    );
  }
}

module.exports = { getCityCode };
