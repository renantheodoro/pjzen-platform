const { logApi } = require("../../../data/log-api");
const errorHandler = require("../../../data/error-handler");
const validateRequest = require("../../common/validate-request");
const getCancellationInvoiceByProtocolApi = require("../../plug-notas-api/issuance/get-cancellation-invoice-by-protocol-api");

const apiServiceTitle = "GET CANCELLATION STATUS BY PROTOCOL";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { nfProtocol, nfId } = req.body;

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      logApi(
        apiServiceTitle,
        `Iniciando busca do status de cancelamento da nota fiscal pelo protocolo: ${nfProtocol}`
      );

      /* GET FROM PLUG NOTAS */
      const plugNotasResponse = await getCancellationInvoiceByProtocolApi.call(
        nfProtocol
      );

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      const nfData = {
        nfId,
        nfProtocol,
        data: plugNotasResponse.data,
      };

      const successMessage =
        "Busca por status de cancelamento de nota fiscal realizada com sucesso!";
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
