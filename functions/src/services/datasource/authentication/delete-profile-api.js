const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, updateDoc, serverTimestamp } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { PROFILES_ACCOUNT_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "DELETE PROFILE SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    let { profileUid } = req.params;

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!profileUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando exclusão de perfil...");

      const profileReference = doc(
        config.db,
        PROFILES_ACCOUNT_COLLECTION,
        profileUid
      );

      /* UPDATE PROFILE FIREBASE */
      await updateDoc(
        profileReference,
        {
          isActive: false,
          lastModifiedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const successMessage = "Exclusão de perfil realizada com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: {
          deletedProfile: profileUid,
        },
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
