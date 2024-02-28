const config = require("../../firebase/firebase-config");
const { logApi } = require("../../data/log-api");
const { doc, getDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../data/collections");
const validateRequest = require("../common/validate-request");

const apiServiceTitle = "GET CLIENT BY ID SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { clientUid } = req.query;

    try {
      if (!clientUid) {
        throw "invalid-argument";
      }

      logApi(
        apiServiceTitle,
        `Iniciando busca pelo cliente com UID: ${clientUid}`
      );

      const clientCompanyRef = doc(
        collection(config.db, CLIENT_COMPANIES_COLLECTION),
        clientUid
      );
      const clientCompanySnapshot = await getDoc(clientCompanyRef);

      if (clientCompanySnapshot.exists()) {
        const clientCompanyData = clientCompanySnapshot.data();

        const successMessage = "Busca pelo cliente realizada com sucesso!";
        logApi(apiServiceTitle, successMessage);

        res.status(200).send({
          status: 200,
          message: successMessage,
          data: clientCompanyData,
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
