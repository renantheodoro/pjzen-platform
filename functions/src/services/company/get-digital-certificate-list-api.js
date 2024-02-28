const { getDoc, doc, collection } = require("firebase/firestore");
const config = require("../../firebase/firebase-config");
const { logApi } = require("../../data/log-api");
const errorHandler = require("../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../data/collections");
const validateRequest = require("../common/validate-request");

const apiServiceTitle = "GET DIGITAL CERTIFICATE LIST SERVICE";

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

      logApi(apiServiceTitle, "Iniciando busca por certificados digitais...");

      const collectionRef = collection(config.db, CLIENT_COMPANIES_COLLECTION);
      const documentRef = doc(collectionRef, clientUid);
      const documentSnapshot = await getDoc(documentRef);

      let digitalCertificatesData = [];

      if (documentSnapshot.exists()) {
        const relatedDigitalCertificatesRefs =
          documentSnapshot.data()?.relatedCertificates;

        if (relatedDigitalCertificatesRefs?.length > 0) {
          const digitalCertificatesPromises =
            relatedDigitalCertificatesRefs.map(async (certificateRef) => {
              const certificateSnapshot = await getDoc(certificateRef);

              if (certificateSnapshot.exists()) {
                return certificateSnapshot.data();
              }

              return null;
            });

          const clientCompaniesSnapshots = await Promise.all(
            digitalCertificatesPromises
          );

          digitalCertificatesData = clientCompaniesSnapshots.filter(
            (data) => data !== null
          );
        }
      }

      const clientCompanyData = {
        uid: clientUid,
        digitalCertificatesData,
      };

      const successMessage = "Busca de certificados realizada com sucesso!";
      logApi(apiServiceTitle, successMessage);

      console.log("successMessage", successMessage);

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
