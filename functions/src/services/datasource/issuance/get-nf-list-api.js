const { getDoc, doc } = require("firebase/firestore");
const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET NF LIST";

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

      logApi(apiServiceTitle, "Buscando lista de notas fiscais...");

      const companyDocRef = await getDoc(
        doc(config.db, CLIENT_COMPANIES_COLLECTION, companyUid)
      );

      if (!companyDocRef.exists()) {
        throw "error/not-found";
      }

      const relatedNFsRef = companyDocRef.data().relatedNFs || [];
      const relatedNFsData = [];

      for (const nfRef of relatedNFsRef) {
        const serviceDocSnapshot = await getDoc(nfRef);
        if (serviceDocSnapshot.exists()) {
          relatedNFsData.push(serviceDocSnapshot.data());
        }
      }

      const successMessage =
        "Notas fiscais relacionadas encontradas com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: relatedNFsData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
