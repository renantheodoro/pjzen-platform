const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const {
  doc,
  collection,
  updateDoc,
  serverTimestamp,
} = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const {
  CLIENT_DIGITAL_CERTIFICATE_COLLECTION,
} = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");
const deleteDigitalCertificateApi = require("../../plug-notas-api/certificate/delete-digital-certificate-api");

const apiServiceTitle = "DELETE CERTIFICATE BY ID SERVICE";

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
        `Iniciando exclusão do certificado: ${certificateId}`
      );

      /* DELETE DIGITAL CERTIFICATE PLUG NOTAS */
      const plugNotasCertificateData = await deleteDigitalCertificateApi.call(
        certificateId
      );

      if (!plugNotasCertificateData.data) {
        return res
          .status(plugNotasCertificateData.status)
          .send(plugNotasCertificateData);
      }

      const certificateRef = doc(
        collection(config.db, CLIENT_DIGITAL_CERTIFICATE_COLLECTION),
        certificateId
      );

      await updateDoc(certificateRef, {
        isActive: false,
        lastModifiedAt: serverTimestamp(),
      });

      const successMessage = "Exclusão do certificado realizada com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: {
          certificateId,
        },
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
