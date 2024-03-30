const { logApi } = require("../../../data/log-api");
const errorHandler = require("../../../data/error-handler");
const validateRequest = require("../../common/validate-request");
const downloadInvoicePdfApi = require("../../plug-notas-api/issuance/download-invoice-pdf-api");

const apiServiceTitle = "DOWNLOAD NF PDF SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;
    const nfId = req.body.nfId;

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      logApi(apiServiceTitle, "Iniciando download da nota fiscal...");

      /* REGISTER COMPANY PLUG NOTAS */
      const plugNotasResponse = await downloadInvoicePdfApi.call(nfId);

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      const nfData = {
        nfId,
        plugNotasData: plugNotasResponse.data,
      };

      const successMessage = "Download da nota fiscal realizado com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: nfData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
