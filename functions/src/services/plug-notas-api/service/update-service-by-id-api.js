const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "UPDATE SERVICE BY ID";

module.exports = {
  async getCurrentService(serviceId) {
    const response = await axios.get(
      `${process.env.PLUG_NOTAS_BASE_URL_DEV}/nfse/servico/${serviceId}`,
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

  async call(req, res) {
    const serviceId = req.params.serviceId;

    const {
      iss,
      obra,
      valor,
      deducao,
      retencao,
      tributosFederaisRetidos,
      codigoTributacao,
      idIntegracao,
      informacoesLegais,
      evento,
      descricaoCidadeIncidencia,
      codigoCidadeIncidencia,
      discriminacao,
      codigo,
      cnae,
      id,
    } = req.body;

    try {
      // const currentTakerData = await module.exports.getCurrentService(
      //   serviceId
      // );

      const requestBody = {
        iss,
        obra,
        valor,
        deducao,
        retencao,
        tributosFederaisRetidos,
        codigoTributacao,
        idIntegracao,
        informacoesLegais,
        evento,
        descricaoCidadeIncidencia,
        codigoCidadeIncidencia,
        discriminacao,
        codigo,
        cnae,
        id,
      };

      const response = await axios.patch(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/nfse/servico/${serviceId}`,
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
