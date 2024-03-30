const { doc, serverTimestamp, setDoc } = require("firebase/firestore");
const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { arrayUnion, updateDoc } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const {
  CLIENT_COMPANIES_COLLECTION,
  CLIENT_DIGITAL_CERTIFICATE_COLLECTION,
} = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");
const registerDigitalCertificateService = require("../../plug-notas-api/certificate/register-digital-certificate-api");
const getDigitalCertificateByIdApi = require("../../plug-notas-api/certificate/get-digital-certificate-by-id-api");

const apiServiceTitle = "SAVE DIGITAL CERTIFICATE SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { companyUid, password, email, fileBase64 } = req.body;

    try {
      logApi(apiServiceTitle, "Salvando certificado digital...");

      const digitalCertificationData = {
        companyUid: companyUid,
        fileBase64: fileBase64,
        password,
        email,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      };

      /* REGISTER DIGITAL CERTIFICATE PLUG NOTAS */
      const plugNotasResponse = await registerDigitalCertificateService.call(
        digitalCertificationData
      );

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      /* SAVE DIGITAL CERTIFICATE FIREBASE */
      const companyReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        companyUid
      );

      const certificateId = plugNotasResponse.data.id;

      const getCertificatePlugNotasResponse =
        await getDigitalCertificateByIdApi.call(certificateId);

      if (!getCertificatePlugNotasResponse.data) {
        return res
          .status(getCertificatePlugNotasResponse.status)
          .send(getCertificatePlugNotasResponse);
      }

      digitalCertificationData.companyReference = companyReference;
      digitalCertificationData.plugNotasCertificateData =
        getCertificatePlugNotasResponse.data;

      await setDoc(
        doc(config.db, CLIENT_DIGITAL_CERTIFICATE_COLLECTION, certificateId),
        digitalCertificationData
      );

      const digitalCertificateReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        certificateId
      );

      await updateDoc(companyReference, {
        relatedCertificates: arrayUnion(digitalCertificateReference),
      });

      const successMessage = "Certificado digital salvo com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: { companyUid, certificateId, digitalCertificationData },
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
