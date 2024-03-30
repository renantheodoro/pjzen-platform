const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "DELETE DIGITAL CERTIFICATE";

module.exports = {
  async call(req, res) {
    try {
      const certificateId = req.params.certificateId;
      const response = await axios.delete(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/certificado/${certificateId}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

      // TODO: integrar com o firebase (salvar dados no banco)

      if (response?.data?.data?.id) {
        res.status(response.status).send({
          status: response.status,
          message: response.data.message,
          data: {
            certificateId: response.data.data.id,
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
