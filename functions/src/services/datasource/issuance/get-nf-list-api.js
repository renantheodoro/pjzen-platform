const {
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} = require("firebase/firestore");
const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");
const getInvoiceResumeApi = require("../../plug-notas-api/issuance/get-invoice-resume-api");

const apiServiceTitle = "GET NF LIST";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;
    const { companyUid } = req.query;

    try {
      // Validação de requisição
      validateRequest(apiKey);

      if (!companyUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Buscando lista de notas fiscais...");

      const companyDocRef = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        companyUid
      );
      const companyDocSnapshot = await getDoc(companyDocRef);

      if (!companyDocSnapshot.exists()) {
        throw "error/not-found";
      }

      const relatedNFsRef = companyDocSnapshot.data().relatedNFs || [];
      const relatedNFsData = [];

      for (const nfRef of relatedNFsRef) {
        const nfDocSnapshot = await getDoc(nfRef);

        if (!nfDocSnapshot.exists()) {
          throw "error/not-found";
        }

        const nfData = nfDocSnapshot.data();
        const nfId = nfData?.plugNotasNfData?.nfId ?? nfData?.plugNotasNfData?.id;

        nfData.id = nfId;

        let updatedNfResume;

        try {
          updatedNfResume = await getInvoiceResumeApi.call(nfId);
        } catch (error) {
          console.error("Error fetching updated resume for NF:", error);
          continue;
        }

        if (updatedNfResume.data) {
          // Cria ou atualiza os campos dentro de plugNotasNfData conforme necessário
          const updatedPlugNotasNfData = {
            ...(nfData?.plugNotasNfData || {}),
            ...updatedNfResume.data[0],
          };

          await updateDoc(nfRef, {
            plugNotasNfData: updatedPlugNotasNfData,
            lastModifiedAt: serverTimestamp(),
          });
        }

        relatedNFsData.push(nfData);
      }

      logApi(
        apiServiceTitle,
        "Notas fiscais relacionadas encontradas com sucesso!"
      );

      res.status(200).send({
        status: 200,
        message: "Notas fiscais relacionadas encontradas com sucesso!",
        data: relatedNFsData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
