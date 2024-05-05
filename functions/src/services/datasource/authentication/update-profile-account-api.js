const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, getDoc, updateDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { PROFILES_ACCOUNT_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "UPDATE PROFILE ACCOUNT";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { profileUid, newPermission } = req.body;

    try {
      logApi(apiServiceTitle, "Iniciando atualização de colaborador...");

      const profileDoc = doc(
        collection(config.db, PROFILES_ACCOUNT_COLLECTION),
        profileUid
      );

      const profileSnapshot = await getDoc(profileDoc);
      if (!profileSnapshot.exists()) {
        throw `error/profile-not-found`;
      }

      await updateDoc(profileDoc, {
        permission: newPermission,
      });

      const response = {
        profileUid,
      };

      const successMessage = "Atualização de perfil realizada com sucesso!";
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
