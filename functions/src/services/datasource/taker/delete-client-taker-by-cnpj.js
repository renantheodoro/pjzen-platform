const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, updateDoc, serverTimestamp } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_TAKER_COLLECTION } = require("../../../data/collections");
const { getCleanCNPJ } = require("../../../helpers/get-clean-cnpj");
const validateRequest = require("../../common/validate-request");
const { decrypt } = require("../../common/encrypt");

const apiServiceTitle = "DELETE CLIENT TAKER";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    let { cnpj } = req.params;

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

      logApi(apiServiceTitle, "Iniciando exclusão de tomador...");

      const clientTakerReference = doc(
        config.db,
        CLIENT_TAKER_COLLECTION,
        getCleanCNPJ(decryptedCNPJ)
      );

      /* UPDATE CLIENT COMPANY FIREBASE */
      await updateDoc(
        clientTakerReference,
        {
          isActive: false,
          lastModifiedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const successMessage = "Exclusão de tomador realizada com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: {
          deletedTaker: decryptedCNPJ,
        },
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
