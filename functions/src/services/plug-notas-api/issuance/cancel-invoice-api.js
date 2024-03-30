const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "CANCEL INVOICE";

module.exports = {
  async call(nfCancellationData) {
    const { code, reason, nfId } = nfCancellationData;

    try {
      const requestBody = {
        codigo: code ?? "",
        motivo: reason ?? "",
      };

      const response = await axios.post(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/nfse/cancelar/${nfId}`,
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
        //   data: JSON.parse(response.data),
        // });
        return {
          status: response.status,
          message: response.data.message,
          data: response.data,
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
