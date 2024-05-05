const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");
const {
  separateNeighborhoodPrefix,
  separateStreetType,
  getTaxRegimeCode,
  separateNumberFromDDDFromPhone,
} = require("../../../helpers/helpers");

const { getCityCode } = require("../../common/get-city-code");
const { getCleanDocument } = require("../../../helpers/get-clean-document");

const apiServiceTitle = "UPDATE COMPANY BY cpfCnpj";

module.exports = {
  async getCurrentCompany(cpfCnpj) {
    const response = await axios.get(
      `${process.env.PLUG_NOTAS_BASE_URL_DEV}/empresa/${cpfCnpj}`,
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

  async call(companyData) {
    const {
      cpfCnpj,
      address,
      phone,
      tradeName,
      businessName,
      taxRegime,
      municipalRegistration,
      email,
      certificateId,
    } = companyData;

    try {
      const currentCompanyData = await module.exports.getCurrentCompany(
        cpfCnpj
      );

      const cityCode = await getCityCode(address.city);

      const requestBody = {
        regimeTributarioEspecial: null,
        cpfCnpj: getCleanDocument(cpfCnpj),
        inscricaoMunicipal: municipalRegistration,
        razaoSocial: tradeName,
        nomeFantasia: businessName,
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
        certificado: certificateId ?? currentCompanyData.certificateId,
        simplesNacional: getTaxRegimeCode(taxRegime) === 1,
        regimeTributario: getTaxRegimeCode(taxRegime), // 0 - Nenhum | 1 - Simples Nacional | 2 - Simples Nacional - Excesso | 3 - Regime Normal - Lucro Presumido | 4 - Normal - Lucro Real
      };

      const response = await axios.patch(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/empresa/${cpfCnpj}`,
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
