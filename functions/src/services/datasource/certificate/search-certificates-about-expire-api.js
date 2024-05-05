const { doc, getDoc } = require("firebase/firestore");
const { addDays, isBefore } = require("date-fns");
const config = require("../../../firebase/firebase-config");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET EXPIRING DIGITAL CERTIFICATE LIST SERVICE";

async function getExpiringCertificates(companyData) {
  const currentDate = new Date();
  const futureDate = addDays(currentDate, 15);

  const expiringCertificates = [];

  if (companyData.relatedCertificates) {
    for (const certRef of companyData.relatedCertificates) {
      const certDoc = await getDoc(certRef);

      if (certDoc.exists()) {
        const certData = certDoc.data();
        const vencimento = new Date(
          certData.plugNotasCertificateData.vencimento
        );

        // Verificar se a data de vencimento está dentro dos próximos 15 dias
        if (isBefore(vencimento, futureDate)) {
          expiringCertificates.push({
            id: certDoc.id,
            data: certData,
          });
        }
      }
    }
  }

  return expiringCertificates;
}

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    const { companyUid } = req.params;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    try {
      const companyReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        companyUid
      );

      const companySnapshot = await getDoc(companyReference);

      let companyData;

      if (companySnapshot.exists()) {
        companyData = companySnapshot.data();
      } else {
        throw "error/not-found";
      }

      let expiringCertificatesData = await getExpiringCertificates(companyData);

      const successMessage =
        "Busca de certificados expirando realizada com sucesso!";

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: expiringCertificatesData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
