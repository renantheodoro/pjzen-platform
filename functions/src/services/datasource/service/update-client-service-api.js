const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const {
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_SERVICES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "UPDATE SERVICE CLIENT SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    const { serviceUid } = req.params;

    const {
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

      if (!serviceUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando atualização de serviço...");

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
        lastModifiedAt: serverTimestamp(),
      };

      const serviceReference = doc(
        config.db,
        CLIENT_SERVICES_COLLECTION,
        serviceUid
      );

      // Verificando se o serviço existe
      const serviceDoc = await getDoc(serviceReference);
      if (!serviceDoc.exists()) {
        throw "error/not-found";
      }

      // Atualizando os dados do serviço
      await updateDoc(serviceReference, serviceData);

      const successMessage = "Serviço atualizado com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: { serviceUid, serviceData },
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
