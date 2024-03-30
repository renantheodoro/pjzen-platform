const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, updateDoc, serverTimestamp } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_NF_COLLECTION } = require("../../../data/collections");
const { NF_STATUS_CANCELLED } = require("../../../data/nf-status");
const validateRequest = require("../../common/validate-request");
const cancelInvoiceApi = require("../../plug-notas-api/issuance/cancel-invoice-api");

const apiServiceTitle = "CANCEL NF SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    const { nfId } = req.body;

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      logApi(apiServiceTitle, "Iniciando cancelamento de nota fiscal...");

      const issueNfData = {
        nfId,
      };

      /* REGISTER COMPANY PLUG NOTAS */
      const plugNotasResponse = await cancelInvoiceApi.call(issueNfData);

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      const nfReference = doc(config.db, CLIENT_NF_COLLECTION, nfId);

      /* UPDATE NF ON FIREBASE */
      await updateDoc(
        nfReference,
        {
          status: NF_STATUS_CANCELLED,
          lastModifiedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const nfData = {
        nfId,
        data: plugNotasResponse.data,
      };

      console;

      const successMessage =
        "Processo de cancelamento de nota fiscal emitido com sucesso!";
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
