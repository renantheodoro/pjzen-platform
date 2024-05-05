const { getDoc, doc, collection } = require("firebase/firestore");
const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET DIGITAL CERTIFICATE LIST SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { companyUid } = req.query;

    try {
      if (!companyUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando busca por certificados digitais...");

      const collectionRef = collection(config.db, CLIENT_COMPANIES_COLLECTION);
      const companyRef = doc(collectionRef, companyUid);
      const companySnapshot = await getDoc(companyRef);

      let digitalCertificatesData = [];

      if (companySnapshot.exists()) {
        const companyData = companySnapshot.data();

        const relatedDigitalCertificatesRefs = companyData?.relatedCertificates;

        if (relatedDigitalCertificatesRefs?.length > 0) {
          const digitalCertificatesPromises =
            relatedDigitalCertificatesRefs.map(async (certificateRef) => {
              const certificateSnapshot = await getDoc(certificateRef);

              if (certificateSnapshot.exists()) {
                const certificateData = certificateSnapshot.data();
                return { id: certificateSnapshot.id, ...certificateData }; // Adiciona o .id ao objeto retornado
              }

              return null;
            });

          const clientCompaniesSnapshots = await Promise.all(
            digitalCertificatesPromises
          );

          digitalCertificatesData = clientCompaniesSnapshots.filter(
            (data) => data !== null
          );

          // Ordenar digitalCertificatesData por data de vencimento mais recente
          digitalCertificatesData.sort((a, b) => {
            const dateA = new Date(a.plugNotasCertificateData.vencimento);
            const dateB = new Date(b.plugNotasCertificateData.vencimento);
            return dateB - dateA;
          });
        }
      }

      const clientCompanyData = {
        uid: companyUid,
        digitalCertificatesData,
      };

      const successMessage = "Busca de certificados realizada com sucesso!";
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
