/**
 * EXEMPLO DE PAYLOAD:
 * 
{
  "codigo": "1.02",
  "idIntegracao": "A001XT",
  "discriminacao": "Descrição dos serviços prestados, utilize | para quebra de linha na impressão.",
  "codigoTributacao": "4115200",
  "cnae": "4751201",
  "codigoCidadeIncidencia": "4115200",
  "descricaoCidadeIncidencia": "MARINGA",
  "unidade": "UN",
  "quantidade": 1,
  "iss": {
    "tipoTributacao": 6,
    "exigibilidade": 1,
    "retido": false,
    "aliquota": 3,
    "valor": 0,
    "valorRetido": 0,
    "processoSuspensao": "70049875465"
  },
  "obra": {
    "art": "6270201",
    "codigo": "21",
    "cei": "string"
  },
  "valor": {
    "servico": 0.1,
    "baseCalculo": 0.1,
    "deducoes": 0,
    "descontoCondicionado": 0,
    "descontoIncondicionado": 0,
    "liquido": 0.1,
    "unitario": 0.1
  },
  "deducao": {
    "tipo": 0,
    "descricao": "Sem Deduções"
  },
  "retencao": {
    "pis": {
      "baseCalculo": 0,
      "retido": 0,
      "aliquota": 0,
      "valor": 0
    },
    "cofins": {
      "baseCalculo": 0,
      "retido": 0,
      "aliquota": 0,
      "valor": 0
    },
    "csll": {
      "aliquota": 0,
      "valor": 0
    },
    "inss": {
      "aliquota": 0,
      "valor": 0
    },
    "irrf": {
      "aliquota": 0,
      "valor": 0
    },
    "outrasRetencoes": 0,
    "cpp": {
      "aliquota": 0,
      "valor": 0
    }
  },
  "tributavel": true,
  "ibpt": {
    "simplificado": {
      "aliquota": 0
    },
    "detalhado": {
      "aliquota": {
        "municipal": 0,
        "estadual": 0,
        "federal": 0
      }
    }
  },
  "responsavelRetencao": "string"
}
 */

const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "REGISTER SERVICE";

module.exports = {
  async call(req, res) {
    const {
      codigo,
      idIntegracao,
      discriminacao,
      codigoTributacao,
      cnae,
      codigoCidadeIncidencia,
      descricaoCidadeIncidencia,
      unidade,
      quantidade,
      iss,
      obra,
      valor,
      deducao,
      retencao,
      tributavel,
      ibpt,
      responsavelRetencao,
    } = req.body;

    try {
      const requestBody = {
        codigo,
        idIntegracao,
        discriminacao,
        codigoTributacao,
        cnae,
        codigoCidadeIncidencia,
        descricaoCidadeIncidencia,
        unidade,
        quantidade,
        iss,
        obra,
        valor,
        deducao,
        retencao,
        tributavel,
        ibpt,
        responsavelRetencao,
      };

      const response = await axios.post(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/nfse/servico`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

      if (response?.data) {
        res.status(response.status).send({
          status: response.status,
          message: response.data.message,
          data: JSON.parse(response.config.data),
        });
      } else {
        const errorResponse = plugNotasErrorHandler(
          response.error,
          apiServiceTitle
        );
        res.status(errorResponse.status).send(errorResponse);
      }
    } catch (error) {
      const errorResponse = plugNotasErrorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
