const { getStorage, ref, uploadBytes } = require("firebase/storage");
const {
  doc,
  addDoc,
  serverTimestamp,
  collection,
} = require("firebase/firestore");
const config = require("../../firebase/firebase-config");
const { logApi } = require("../../data/log-api");
const { arrayUnion, updateDoc } = require("firebase/firestore");
const errorHandler = require("../../data/error-handler");
const {
  CLIENT_COMPANIES_COLLECTION,
  CLIENT_DIGITAL_CERTIFICATE_COLLECTION,
} = require("../../data/collections");
const validateRequest = require("../common/validate-request");

const apiServiceTitle = "SAVE DIGITAL CERTIFICATE SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { clientUid, type, password, file } = req.body;

    try {
      const fileBuffer = Buffer.from(file, "base64");

      logApi(apiServiceTitle, "Salvando certificado digital...");

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().replace(/[:.]/g, "-");
      const fileName = `certificate-${formattedDate}.pdf`;

      const storage = getStorage();
      const storageRef = ref(storage, `certificates/${clientUid}/${fileName}`);
      await uploadBytes(storageRef, fileBuffer);

      const digitalCertificationData = {
        type,
        fileReference: storageRef.fullPath,
        password,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      };

      const clientReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        clientUid
      );

      digitalCertificationData.clientReference = clientReference;

      const digitalCertificateReference = await addDoc(
        collection(config.db, CLIENT_DIGITAL_CERTIFICATE_COLLECTION),
        digitalCertificationData
      );

      await updateDoc(clientReference, {
        relatedCertificates: arrayUnion(digitalCertificateReference),
      });

      const certificateId = digitalCertificateReference.id;

      const successMessage = "Certificado digital salvo com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: { clientUid, certificateId, digitalCertificationData },
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
