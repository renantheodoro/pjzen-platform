const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const {
  doc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
} = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_NF_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");
const getInvoiceByNfIdApi = require("../../plug-notas-api/issuance/get-invoice-by-nf-id-api");

const apiServiceTitle = "GET NF BY NF ID SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { nfId } = req.params;

    try {
      logApi(
        apiServiceTitle,
        `Iniciando busca pela nota fiscal com id: ${nfId}`
      );

      /* GET FROM PLUG NOTAS */
      const plugNotasResponse = await getInvoiceByNfIdApi.call(nfId);

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      const nfReference = doc(
        collection(config.db, CLIENT_NF_COLLECTION),
        nfId
      );

      /* UPDATE NF ON FIREBASE */
      await updateDoc(nfReference, {
        plugNotasNfData: plugNotasResponse.data,
        lastModifiedAt: serverTimestamp(),
      });

      const nfSnapshot = await getDoc(nfReference);

      if (nfSnapshot.exists()) {
        const nfData = nfSnapshot.data();

        const serviceRefPath = nfData.serviceReference;
        const takerRefPath = nfData.takerReference;

        // Extrair IDs de serviceReference e takerReference
        const serviceRefId = serviceRefPath.split("/").pop();
        const takerRefId = takerRefPath.split("/").pop();

        nfData.service.id = serviceRefId;
        nfData.taker.id = takerRefId;

        const successMessage = "Busca pela nota fiscal realizada com sucesso!";
        logApi(apiServiceTitle, successMessage);

        res.status(200).send({
          status: 200,
          message: successMessage,
          data: nfData,
        });
      } else {
        throw "not-found";
      }
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
