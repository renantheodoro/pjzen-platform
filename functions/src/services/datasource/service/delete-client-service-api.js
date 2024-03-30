const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, updateDoc, serverTimestamp } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_SERVICES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "DELETE CLIENT SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    let { serviceUid } = req.params;

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!serviceUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando exclusão de serviço...");

      const clientTakerReference = doc(
        config.db,
        CLIENT_SERVICES_COLLECTION,
        serviceUid
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

      const successMessage = "Exclusão de serviço realizada com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: {
          deletedService: serviceUid,
        },
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
