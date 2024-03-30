const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "GET DIGITAL CERTIFICATE BY ID";

module.exports = {
  async call(certificateIdOrCpfCnpj) {
    try {
      const response = await axios.get(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/certificado/${certificateIdOrCpfCnpj}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

      if (response?.data) {
        // res.status(response.status).send({
        //   status: response.status,
        //   message: response.data.message,
        //   data: {
        //     certificate: response.data,
        //   },
        // });
        return {
          status: response.status,
          message: response.message,
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
