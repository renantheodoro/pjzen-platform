const { getDoc, doc } = require("firebase/firestore");
const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET CLIENT SERVICE LIST";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;
    const { companyUid } = req.body;

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!companyUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Buscando lista de serviços...");

      const companyDocRef = await getDoc(doc(config.db, CLIENT_COMPANIES_COLLECTION, companyUid));

      if (!companyDocRef.exists()) {
        throw "error/not-found";
      }

      const relatedServicesRef = companyDocRef.data().relatedServices || [];
      const relatedServicesData = [];

      for (const serviceRef of relatedServicesRef) {
        const serviceDocSnapshot = await getDoc(serviceRef);
        if (serviceDocSnapshot.exists()) {
          relatedServicesData.push(serviceDocSnapshot.data());
        }
      }

      const successMessage = "Serviços relacionados encontrados com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: relatedServicesData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
