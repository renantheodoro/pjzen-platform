/**
 * EXEMPLO DE PAYLOAD:
 * 
 * 
 * [
  {
    "idIntegracao": "XXXYY999",
    "prestador": {
      "cpfCnpj": "08187168000160"
    },
    "tomador": {
      "cpfCnpj": "99999999999999",
      "razaoSocial": "Empresa de Teste LTDA",
      "inscricaoMunicipal": "8214100099",
      "email": "teste@plugnotas.com.br",
      "endereco": {
        "descricaoCidade": "Maringa",
        "cep": "87020100",
        "tipoLogradouro": "Rua",
        "logradouro": "Barao do rio branco",
        "tipoBairro": "Centro",
        "codigoCidade": "4115200",
        "complemento": "sala 01",
        "estado": "PR",
        "numero": "1001",
        "bairro": "Centro"
      }
    },
    "servico": [
      {
        "codigo": "14.10",
        "codigoTributacao": "14.10",
        "discriminacao": "Descrição dos serviços prestados, utilize | para quebra de linha na impressão.",
        "cnae": "7490104",
        "iss": {
          "tipoTributacao": 7,
          "exigibilidade": 1,
          "aliquota": 3
        },
        "valor": {
          "servico": 1,
          "descontoCondicionado": 0,
          "descontoIncondicionado": 0
        }
      }
    ]
  }
]
 */

const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");
const {
  separateNeighborhoodPrefix,
  separateStreetType,
} = require("../../../helpers/helpers");
const { getCityCode } = require("../../common/get-city-code");

const apiServiceTitle = "ISSUE INVOICE";

module.exports = {
  async call(nfData) {
    const { providerCnpj, integrationId, taker, service } = nfData;

    try {
      const cityCode = await getCityCode(taker.address.city);

      const nfRequestData = [
        {
          idIntegracao: integrationId,
          prestador: {
            cpfCnpj: providerCnpj,
          },
          tomador: {
            cpfCnpj: taker.cnpj,
            razaoSocial: taker.businessName,
            inscricaoMunicipal: taker.municipalRegistration,
            email: taker.email,
            endereco: {
              tipoBairro: separateNeighborhoodPrefix(taker.address.neighborhood)
                .type,
              bairro: separateNeighborhoodPrefix(taker.address.neighborhood)
                .name,
              cep: taker.address.zipcode,
              codigoCidade: cityCode.toString(),
              estado: taker.address.uf,
              tipoLogradouro: separateStreetType(taker.address.street).type,
              logradouro: separateStreetType(taker.address.street).name,
              numero: taker.address.number,
              codigoPais: "1058", // Brazil code
              complemento: taker.address.complement,
              descricaoCidade: taker.address.city,
              descricaoPais: "Brasil",
            },
          },
          servico: [
            {
              codigo: service.internalCode,
              codigoTributacao: "14.10", // TODO: adicionar o valor real
              discriminacao: service.serviceName,
              cnae: service.cnae,
              iss: {
                tipoTributacao: 7, // TODO: adicionar o valor real
                exigibilidade: 1, // TODO: adicionar o valor real
                aliquota: 3, // TODO: adicionar o valor real
              },
              valor: {
                servico: 1, // TODO: adicionar o valor real
                descontoCondicionado: 0, // TODO: adicionar o valor real
                descontoIncondicionado: 0, // TODO: adicionar o valor real
              },
            },
          ],
        },
      ];

      const response = await axios.post(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/nfse`,
        nfRequestData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

      if (response?.data) {
        const responseData = nfRequestData[0];

        responseData.nfId = response.data.documents[0].id;
        responseData.protocol = response.data.protocol;

        // res.status(response.status).send({
        //   status: response.status,
        //   message: response.data.message,
        //   data: JSON.parse(response.config.data),
        // });
        return {
          status: response.status,
          message: response.data.message,
          data: responseData,
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
