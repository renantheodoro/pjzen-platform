const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "GET COMPANY BY CNPJ";

module.exports = {
  async call(cpfCnpj) {
    try {
      const response = await axios.get(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/empresa/${cpfCnpj}`,
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
        //     companyData: response.data,
        //   },
        // });
        return {
          status: response.status,
          message: response.data.message,
          data: {
            companyData: response.data,
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
