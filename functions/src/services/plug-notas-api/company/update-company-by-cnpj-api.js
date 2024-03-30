const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");
const {
  separateNeighborhoodPrefix,
  separateStreetType,
  getTaxRegimeCode,
  separateNumberFromDDDFromPhone,
} = require("../../../helpers/helpers");

const { getCityCode } = require("../../common/get-city-code");
const { getCleanCNPJ } = require("../../../helpers/get-clean-cnpj");

const apiServiceTitle = "UPDATE COMPANY BY CNPJ";

module.exports = {
  async getCurrentCompany(cnpj) {
    const response = await axios.get(
      `${process.env.PLUG_NOTAS_BASE_URL_DEV}/empresa/${cnpj}`,
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
      cnpj,
      address,
      comercialPhone,
      tradeName,
      businessName,
      taxRegime,
      municipalRegistration,
      email,
    } = companyData;

    try {
      const currentCompanyData = await module.exports.getCurrentCompany(cnpj);

      const cityCode = await getCityCode(address.city);

      const requestBody = {
        // UPDATED FIELDS
        cpfCnpj: getCleanCNPJ(cnpj),
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
        telefone: separateNumberFromDDDFromPhone(comercialPhone),
        email: email,

        // IMMUTABLED FIELDS
        // cnae: null, // TODO: Não tem na api
        // dataDeFundacao: null, // TODO: Não tem na api
        // aEmpresaOferece: null, // TODO: Não tem na api

        certificado: currentCompanyData.certificado,
        simplesNacional: getTaxRegimeCode(taxRegime) === 1,
        regimeTributario: getTaxRegimeCode(taxRegime), // 0 - Nenhum | 1 - Simples Nacional | 2 - Simples Nacional - Excesso | 3 - Regime Normal - Lucro Presumido | 4 - Normal - Lucro Real

        // nfse: currentCompanyData.nfse,
        // nfe: currentCompanyData.nfe,
        // nfce: currentCompanyData.nfce,
        // mdfe: currentCompanyData.mdfe,
        // cfe: currentCompanyData.cfe,
        // incentivoFiscal: currentCompanyData.incentivoFiscal,
        // incentivadorCultural: currentCompanyData.incentivadorCultural,
        // inscricaoEstadual: currentCompanyData.inscricaoEstadual,
      };

      console.log("requestBody", requestBody);

      const response = await axios.patch(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/empresa/${cnpj}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

      console.log("response", response);

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
