const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, getDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { PROFILES_ACCOUNT_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET PROFILE BY UID SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { profileUid } = req.query;

    try {
      if (!profileUid) {
        throw "invalid-argument";
      }

      logApi(
        apiServiceTitle,
        `Iniciando busca pelo perfil com UID: ${profileUid}`
      );

      const profileRef = doc(
        collection(config.db, PROFILES_ACCOUNT_COLLECTION),
        profileUid
      );

      const profileSnapshot = await getDoc(profileRef);

      if (profileSnapshot.exists()) {
        const profileData = profileSnapshot.data();

        const accountancySnapshot = await getDoc(
          profileData.accountancyReference
        );

        if (accountancySnapshot.exists()) {
          profileData.accountancyData = accountancySnapshot.data();

          console.log

          const successMessage = "Busca pelo perfil realizada com sucesso!";
          logApi(apiServiceTitle, successMessage);

          res.status(200).send({
            status: 200,
            message: successMessage,
            data: profileData,
          });
        } else {
          throw "not-found";
        }
      } else {
        throw "not-found";
      }
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
