const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "GET DIGITAL CERTIFICATE LIST";

module.exports = {
  async call(req, res) {
    try {
      const response = await axios.get(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/certificado/`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

      if (response?.data) {
        res.status(response.status).send({
          status: response.status,
          message: response.data.message,
          data: {
            certificateList: response.data,
          },
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
