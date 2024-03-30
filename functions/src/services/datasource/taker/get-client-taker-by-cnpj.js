const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, getDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_TAKER_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");
const { getCleanCNPJ } = require("../../../helpers/get-clean-cnpj");
const { decrypt } = require("../../common/encrypt");

const apiServiceTitle = "GET CLIENT TAKER BY CNPJ";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { cnpj } = req.params;

    let decryptedCNPJ;

    if (apiKey === process.env.API_KEY_DEV) {
      decryptedCNPJ = cnpj;
    } else {
      decryptedCNPJ = decrypt(cnpj);
    }

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!decryptedCNPJ) {
        throw "invalid-argument";
      }

      logApi(
        apiServiceTitle,
        `Iniciando busca pelo tomador com cnpj: ${decryptedCNPJ}`
      );

      const clientTakerRef = doc(
        collection(config.db, CLIENT_TAKER_COLLECTION),
        getCleanCNPJ(decryptedCNPJ)
      );

      const clientTakerSnapshot = await getDoc(clientTakerRef);

      if (clientTakerSnapshot.exists()) {
        const clientTakerData = clientTakerSnapshot.data();

        const successMessage = "Busca pelo tomador realizada com sucesso!";
        logApi(apiServiceTitle, successMessage);

        res.status(200).send({
          status: 200,
          message: successMessage,
          data: clientTakerData,
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
