const config = require("../../firebase/firebase-config");
const { logApi } = require("../../data/log-api");
const {
  arrayUnion,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
} = require("firebase/firestore");
const errorHandler = require("../../data/error-handler");
const {
  CLIENT_COMPANIES_COLLECTION,
  CLIENT_SERVICES_COLLECTION,
} = require("../../data/collections");
const validateRequest = require("../common/validate-request");

const apiServiceTitle = "CREATE SERVICE CLIENTE SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const {
      clientUid,
      serviceName,
      internalCode,
      type,
      sellingValue,
      cnae,
      coastValue,
      municipalServiceCode,
      complementaryLawCode,
      operationNature,
    } = req.body;

    try {
      logApi(apiServiceTitle, "Iniciando cadastro de serviço...");

      const serviceData = {
        serviceName,
        internalCode,
        type,
        sellingValue,
        cnae,
        coastValue,
        municipalServiceCode,
        complementaryLawCode,
        operationNature,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      };

      const clientReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        clientUid
      );

      serviceData.clientReference = clientReference;

      await setDoc(
        doc(config.db, CLIENT_SERVICES_COLLECTION, internalCode),
        serviceData
      );

      const clientServiceReference = doc(
        config.db,
        CLIENT_SERVICES_COLLECTION,
        internalCode
      );

      await updateDoc(clientReference, {
        relatedServices: arrayUnion(clientServiceReference),
      });

      const response = {
        clientUid,
        serviceId: internalCode,
        serviceData,
      };

      const successMessage = "Cadastro de serviço realizado com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: response,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
