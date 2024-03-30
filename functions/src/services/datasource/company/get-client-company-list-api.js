const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, getDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { ACCOUNTANCIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET CLIENT COMPANY LIST SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { accountancyUid } = req.query;

    try {
      if (!accountancyUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando busca por clientes...");

      const collectionRef = collection(config.db, ACCOUNTANCIES_COLLECTION);
      const documentRef = doc(collectionRef, accountancyUid);
      const documentSnapshot = await getDoc(documentRef);

      let clientCompaniesData = [];

      if (documentSnapshot.exists()) {
        const relatedClientCompaniesRefs =
          documentSnapshot.data()?.relatedClientCompanies;

        if (relatedClientCompaniesRefs?.length > 0) {
          const clientCompaniesPromises = relatedClientCompaniesRefs.map(
            async (clientCompanyRef) => {
              const clientCompanySnapshot = await getDoc(clientCompanyRef);

              if (clientCompanySnapshot.exists()) {
                return clientCompanySnapshot.data();
              }

              return null;
            }
          );

          const clientCompaniesSnapshots = await Promise.all(
            clientCompaniesPromises
          );

          clientCompaniesData = clientCompaniesSnapshots.filter(
            (data) => data !== null
          );
        }
      }

      const clientCompanyData = {
        uid: accountancyUid,
        clientCompaniesData,
      };

      const successMessage = "Busca de clientes realizada com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: clientCompanyData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
