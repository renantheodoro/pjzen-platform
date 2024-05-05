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

function convertStringToFloat(string) {
  // Remove o símbolo de moeda e substitui vírgula por ponto
  const numeroString = string.replace(/[^\d,]/g, "").replace(",", ".");
  // Converte a string para um número float
  const numeroFloat = parseFloat(numeroString);
  return numeroFloat;
}

function convertDateToDateTime(dataString) {
  // Dividir a string em dia, mês e ano
  let partes = dataString.split("/");

  // Criar um objeto Date com ano, mês e dia
  let data = new Date(partes[2], partes[1] - 1, partes[0]);

  // Obter a representação de data e hora ISO 8601
  let dateTimeString = data.toISOString();

  return dateTimeString;
}

module.exports = {
  async call(nfData) {
    const {
      companyUid,
      taker,
      service,
      quantity,
      total,
      totalWithDiscounts,
      rps,
      rpsSerie,
      rpsDate,
      rpsDueDate,
      iss,
      operationNature,
    } = nfData;

    try {
      const cityCode = await getCityCode(taker.address.city);

      const nfRequestData = [
        {
          prestador: {
            cpfCnpj: companyUid,
          },
          tomador: {
            cpfCnpj: taker.cpfCnpj,
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
              discriminacao: service.serviceName,
              cnae: service.cnae.code,
              quantidade: quantity,
              iss: {
                aliquota: iss.value,
              },
              valor: {
                servico: convertStringToFloat(total),
                baseCalculo: convertStringToFloat(totalWithDiscounts),
              },
              responsavelRetencao: iss.responsible === "my-client" ? "2" : "1",
            },
          ],
          naturezaTributacao: parseFloat(operationNature),
          rps: {
            serie: rpsSerie,
            dataEmissao: convertDateToDateTime(rpsDate),
            dataVencimento: convertDateToDateTime(rpsDueDate),
            numero: parseFloat(rps),
          },
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
