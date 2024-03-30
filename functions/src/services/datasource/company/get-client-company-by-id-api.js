const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, getDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET CLIENT COMPANY BY ID SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { companyUid } = req.body;

    try {
      if (!companyUid) {
        throw "invalid-argument";
      }

      logApi(
        apiServiceTitle,
        `Iniciando busca pela empresa com UID: ${companyUid}`
      );

      const clientCompanyRef = doc(
        collection(config.db, CLIENT_COMPANIES_COLLECTION),
        companyUid
      );
      const clientCompanySnapshot = await getDoc(clientCompanyRef);

      if (clientCompanySnapshot.exists()) {
        const clientCompanyData = clientCompanySnapshot.data();

        const successMessage = "Busca pela empresa realizada com sucesso!";
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
