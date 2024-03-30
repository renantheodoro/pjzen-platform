const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, getDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const {
  CLIENT_DIGITAL_CERTIFICATE_COLLECTION,
} = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET CERTIFICATE BY ID SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    const { certificateId } = req.params;

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!certificateId) {
        throw "invalid-argument";
      }

      logApi(
        apiServiceTitle,
        `Iniciando busca pelo certificado com UID: ${certificateId}`
      );

      const certificateRef = doc(
        collection(config.db, CLIENT_DIGITAL_CERTIFICATE_COLLECTION),
        certificateId
      );

      const certificateSnapshot = await getDoc(certificateRef);

      if (certificateSnapshot.exists()) {
        const certificateData = certificateSnapshot.data();

        const successMessage = "Busca pelo certificado realizada com sucesso!";
        logApi(apiServiceTitle, successMessage);

        res.status(200).send({
          status: 200,
          message: successMessage,
          data: certificateData,
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
