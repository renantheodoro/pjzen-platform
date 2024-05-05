const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, getDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET CLIENT TAKER LIST";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { companyUid } = req.params;

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!companyUid) {
        throw "invalid-argument";
      }

      logApi(
        apiServiceTitle,
        `Iniciando busca por tomadores com companyUid: ${companyUid}`
      );

      const companyReference = doc(
        collection(config.db, CLIENT_COMPANIES_COLLECTION),
        companyUid
      );

      const companyReferenceSnapshot = await getDoc(companyReference);

      if (companyReferenceSnapshot.exists()) {
        const companyData = companyReferenceSnapshot.data();

        const relatedClientTakers = companyData.relatedClientTakers;

        const clientTakers = [];

        if (relatedClientTakers?.length) {
          for (const clientTakerRef of relatedClientTakers) {
            const clientTakerSnapshot = await getDoc(clientTakerRef);

            if (clientTakerSnapshot.exists()) {
              const clientTakerData = clientTakerSnapshot.data();

              let latestNF = null;

              if (clientTakerData.relatedNFs) {
                for (const relatedNF of clientTakerData.relatedNFs) {
                  const relatedNFSnapshot = await getDoc(relatedNF);

                  if (relatedNFSnapshot.exists()) {
                    const relatedNFData = relatedNFSnapshot.data();

                    // Verifica se é a primeira nota fiscal ou se é mais recente do que a última encontrada
                    if (
                      !latestNF ||
                      relatedNFData.createdAt > latestNF.createdAt
                    ) {
                      latestNF = relatedNFData; // Atualiza a última nota fiscal mais recente
                    }
                  }
                }
              }

              clientTakerData.id = clientTakerRef.id;
              clientTakerData.latestNF = latestNF;
              clientTakers.push(clientTakerData);
            }
          }
        }

        const successMessage = "Busca pelo tomador realizada com sucesso!";
        logApi(apiServiceTitle, successMessage);

        res.status(200).send({
          status: 200,
          message: successMessage,
          data: {
            clientTakers,
          },
        });
      } else {
        res.status(200).send({
          status: 200,
          message: "Lista de tomadores vazia",
          data: {
            clientTakers: [],
          },
        });
      }
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
