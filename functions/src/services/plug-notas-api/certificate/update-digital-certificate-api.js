const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "UPDATE DIGITAL CERTIFICATE";

module.exports = {
  async call(req, res) {
    try {
      const certificateId = req.params.certificateId;
      const file = req.body.file;
      const password = req.body.password;
      const email = req.body.email || "";

      const response = await axios.put(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/certificado/${certificateId}`,
        {
          arquivo: file,
          senha: password,
          email: email,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

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
