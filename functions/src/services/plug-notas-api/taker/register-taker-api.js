/**
 * EXEMPLO DE PAYLOAD:
 * 
 * {
  "cpfCnpj": "191.0",
  "razaoSocial": "Tomador de teste LTDA",
  "endereco": {
    "bairro": "Zona 01",
    "cep": "87020025",
    "codigoCidade": "4115200",
    "estado": "PR",
    "logradouro": "Duque de Caxias",
    "numero": "882",
    "tipoLogradouro": "Avenida",
    "codigoPais": "1058",
    "complemento": "17 andar",
    "descricaoCidade": "Maringá",
    "descricaoPais": "Brasil",
    "tipoBairro": "Zona"
  },
  "email": "tomador@plugnotas.com.br",
  "inscricaoEstadual": "1234567850",
  "inscricaoMunicipal": "8214100099",
  "inscricaoSuframa": "1234567850",
  "nomeFantasia": "Tomador de teste",
  "orgaoPublico": true,
  "telefone": {
    "numero": "30379500",
    "ddd": "44"
  },
  "indicadorInscricaoEstadual": 9,
  "codigoEstrangeiro": "A1B2C3D4",
  "naoNif": "1"
}
 */

const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");
const {
  separateNeighborhoodPrefix,
  separateStreetType,
  separateNumberFromDDDFromPhone,
} = require("../../../helpers/helpers");

const { getCityCode } = require("../../common/get-city-code");

const apiServiceTitle = "REGISTER TAKER";

module.exports = {
  async call(takerData) {
    const { cnpj, businessName, municipalRegistration, address, phone, email } =
      takerData;

    try {
      const cityCode = await getCityCode(address.city);

      const requestBody = {
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
        email,
        inscricaoMunicipal: municipalRegistration,
        telefone: separateNumberFromDDDFromPhone(phone),
      };

      const response = await axios.post(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/nfse/tomador`,
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
        return errorResponse;
      }
    } catch (error) {
      const errorResponse = plugNotasErrorHandler(error, apiServiceTitle);
      // res.status(errorResponse.status).send(errorResponse);
      return errorResponse;
    }
  },
};
