const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { collection, doc, getDoc } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { ACCOUNTANCIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET PROFILES BY ACCOUNTANCY UID SERVICE";

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
        `Iniciando busca por perfis com accountancyUid: ${accountancyUid}`
      );

      // Buscar o documento na coleção ACCOUNTANCIES_COLLECTION pelo accountancyUid
      const accountancyRef = doc(
        collection(config.db, ACCOUNTANCIES_COLLECTION),
        accountancyUid
      );
      const accountancySnapshot = await getDoc(accountancyRef);

      if (!accountancySnapshot.exists()) {
        throw "not-found";
      }

      const accountancyData = accountancySnapshot.data();

      if (
        !accountancyData.relatedProfiles ||
        accountancyData.relatedProfiles.length === 0
      ) {
        // Se não houver relatedProfiles ou estiver vazio, retornar uma lista vazia
        const successMessage =
          "Nenhum perfil encontrado para esta contabilidade";
        logApi(apiServiceTitle, successMessage);

        res.status(200).send({
          status: 200,
          message: successMessage,
          data: [],
        });
        return;
      }

      // Buscar os perfis correspondentes às referências em relatedProfiles
      const profileDocs = [];
      for (const profileRef of accountancyData.relatedProfiles) {
        const profileSnapshot = await getDoc(profileRef);
        if (profileSnapshot.exists()) {
          profileDocs.push(profileSnapshot.data());
        }
      }

      const successMessage = "Busca pelos perfis realizada com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: profileDocs,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
