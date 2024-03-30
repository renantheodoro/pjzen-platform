const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const {
  arrayUnion,
  updateDoc,
  doc,
  serverTimestamp,
  addDoc,
  collection,
} = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const {
  CLIENT_COMPANIES_COLLECTION,
  CLIENT_SERVICES_COLLECTION,
} = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "CREATE SERVICE CLIENT SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    const {
      companyUid,
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
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!companyUid) {
        throw "invalid-argument";
      }

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
        isActive: true,
      };

      const companyReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        companyUid
      );

      serviceData.companyReference = companyReference;

      const clientServiceReference = await addDoc(
        collection(config.db, CLIENT_SERVICES_COLLECTION),
        serviceData
      );

      await updateDoc(companyReference, {
        relatedServices: arrayUnion(clientServiceReference),
      });

      const response = {
        companyUid,
        serviceId: clientServiceReference.id,
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
