const axios = require("axios");

async function getCityCode(city) {
  try {
    const cityResponse = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
    );

    if (cityResponse?.data?.length) {
      for (let i = 0; i < cityResponse.data.length; i++) {
        if (cityResponse.data[i].nome === city) {
          return cityResponse.data[i].id;
        }
      }

      throw "[API IBGE RESPONSE] Cidade não encontrada";
    } else {
      throw "[API IBGE RESPONSE] Resposta inválida do servidor";
    }
  } catch (error) {
    console.error(
      "[API IBGE RESPONSE] Ocorreu um erro ao buscar o ID da cidade:",
      error
    );
    throw error;
  }
}

module.exports = { getCityCode };
