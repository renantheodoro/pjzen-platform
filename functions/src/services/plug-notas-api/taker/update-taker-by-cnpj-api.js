const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");
const {
  separateNeighborhoodPrefix,
  separateStreetType,
  separateNumberFromDDDFromPhone,
} = require("../../../helpers/helpers");

const { getCityCode } = require("../../common/get-city-code");

const apiServiceTitle = "UPDATE TAKER BY CNPJ";

module.exports = {
  async getCurrentTaker(cnpj) {
    const response = await axios.get(
      `${process.env.PLUG_NOTAS_BASE_URL_DEV}/nfse/tomador/${cnpj}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
        },
      }
    );

    if (response?.data) {
      return response.data; // Retorna apenas os dados da empresa
    } else {
      const errorResponse = plugNotasErrorHandler(
        response.error,
        apiServiceTitle
      );
      throw errorResponse; // Lança o erro para ser tratado no catch
    }
  },

  async call(takerData) {
    const { cnpj, address, businessName, phone, email } = takerData;

    try {
      // const currentTakerData = await module.exports.getCurrentTaker(cnpj);

      const cityCode = await getCityCode(address.city);

      const requestBody = {
        // UPDATED FIELDS
        cpfCnpj: cnpj,
        razaoSocial: businessName,
        endereco: {
          tipoBairro: separateNeighborhoodPrefix(address.neighborhood).type,
          bairro: separateNeighborhoodPrefix(address.neighborhood).name,
          cep: address.zipcode,
          codigoCidade: cityCode.toString(),
          estado: address.uf,
          tipoLogradouro: separateStreetType(address.street).type,
          logradouro: separateStreetType(address.street).name,
          numero: address.number,
          codigoPais: "1058", // Brazil code
          complemento: address.complement,
          descricaoCidade: address.city,
          descricaoPais: "Brasil",
        },
        telefone: separateNumberFromDDDFromPhone(phone),
        email: email,
      };

      const response = await axios.patch(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/nfse/tomador/${cnpj}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

      if (response?.data) {
        // res.status(response.status).send({
        //   status: response.status,
        //   message: response.data.message,
        //   data: JSON.parse(response.config.data),
        // });
        return {
          status: response.status,
          message: response.data.message,
          data: JSON.parse(response.config.data),
        };
      } else {
        const errorResponse = plugNotasErrorHandler(
          response.error,
          apiServiceTitle
        );
        // res.status(errorResponse.status).send(errorResponse);
        return errorResponse;
      }
    } catch (error) {
      const errorResponse = plugNotasErrorHandler(error, apiServiceTitle);
      // res.status(errorResponse.status).send(errorResponse);
      return errorResponse;
    }
  },
};
