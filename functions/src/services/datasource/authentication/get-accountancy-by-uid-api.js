const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, getDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { ACCOUNTANCIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET ACCOUNTANY BY UID SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { accountancyUid } = req.query;

    try {
      if (!accountancyUid) {
        throw "invalid-argument";
      }

      logApi(
        apiServiceTitle,
        `Iniciando busca pela contabilidade com UID: ${accountancyUid}`
      );

      const accountancyRef = doc(
        collection(config.db, ACCOUNTANCIES_COLLECTION),
        accountancyUid
      );
      const accountancySnapshot = await getDoc(accountancyRef);

      if (accountancySnapshot.exists()) {
        const accountancyData = accountancySnapshot.data();

        const successMessage =
          "Busca pela contabilidade realizada com sucesso!";
        logApi(apiServiceTitle, successMessage);

        res.status(200).send({
          status: 200,
          message: successMessage,
          data: accountancyData,
        });
      } else {
        throw "not-found";
      }
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
