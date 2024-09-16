const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "DELETE DIGITAL CERTIFICATE";

module.exports = {
  async call(certificateId) {
    try {
      const response = await axios.delete(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/certificado/${certificateId}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

      if (response?.data?.data?.id) {
        // res.status(response.status).send({
        //   status: response.status,
        //   message: response.data.message,
        //   data: {
        //     certificateId: response.data.data.id,
        //   },
        // });
        return {
          status: response.status,
          message: response.data.message,
          data: {
            certificateId: response.data.data.id,
          },
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
