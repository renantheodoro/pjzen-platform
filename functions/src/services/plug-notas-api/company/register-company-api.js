const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "REGISTER COMPANY";

const {
  separateNeighborhoodPrefix,
  separateStreetType,
  getTaxRegimeCode,
  separateNumberFromDDDFromPhone,
} = require("../../../helpers/helpers");

const { getCityCode } = require("../../common/get-city-code");

module.exports = {
  async call(companyData) {
    const {
      cpfCnpj,
      businessName,
      tradeName,
      taxRegime,
      municipalRegistration,
      address,
      email,
      phone,
      certificateId,
      prefectureLogin,
      prefecturePassword,
    } = companyData;

    try {
      const cityCode = await getCityCode(address.city);

      const plugNotasBody = {
        regimeTributarioEspecial: null,

        cpfCnpj,
        inscricaoMunicipal: municipalRegistration,
        razaoSocial: businessName,
        nomeFantasia: tradeName,
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
        certificado: certificateId,

        simplesNacional: getTaxRegimeCode(taxRegime) === 1,
        regimeTributario: getTaxRegimeCode(taxRegime), // 0 - Nenhum | 1 - Simples Nacional | 2 - Simples Nacional - Excesso | 3 - Regime Normal - Lucro Presumido | 4 - Normal - Lucro Real

        nfse: {
          config: {
            prefeitura: {
              login: prefectureLogin ?? "",
              senha: prefecturePassword ?? "",
            },
          },
        },
      };

      const response = await axios.post(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/empresa`,
        plugNotasBody,
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
        //   data: plugNotasBody,
        // });

        return {
          status: response.status,
          message: response.data.message,
          data: plugNotasBody,
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
