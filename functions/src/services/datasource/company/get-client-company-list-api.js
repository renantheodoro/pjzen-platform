const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, getDoc, collection } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { ACCOUNTANCIES_COLLECTION } = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "GET CLIENT COMPANY LIST SERVICE";

async function getCertificateDueDate(relatedCertificates) {
  let certificateNearestDueDate;
  if (relatedCertificates) {
    // Mapear as referências para objetos contendo o documento e a data de vencimento
    const relatedCertificatesData = await Promise.all(
      relatedCertificates.map(async (certRef) => {
        const certSnapshot = await getDoc(certRef);
        if (certSnapshot.exists()) {
          const certData = certSnapshot.data();
          return {
            document: certData,
            dueDate: certData?.plugNotasCertificateData?.vencimento, // Adapte conforme a estrutura do seu documento
          };
        }
        return null;
      })
    );

    // Filtrar e ordenar as datas de vencimento
    const validDueDates = relatedCertificatesData
      .filter((certData) => certData && certData.dueDate)
      .map((certData) => certData.dueDate)
      .sort((a, b) => a - b); // Ordenar em ordem crescente

    // Definir a menor data de vencimento como nearestDueDate
    if (validDueDates.length > 0) {
      certificateNearestDueDate = new Date(validDueDates[0]).toLocaleDateString(
        "pt-BR"
      );
    }
    return certificateNearestDueDate;
  }
}

async function getNfLastExport(relatedNFs) {
  let nfLastExport;

  if (relatedNFs) {
    // Mapear as referências para objetos contendo o documento e a data de criação
    const relatedNFsData = await Promise.all(
      relatedNFs.map(async (nfRef) => {
        const nfSnapshot = await getDoc(nfRef);
        if (nfSnapshot.exists()) {
          const nfData = nfSnapshot.data();
          return {
            document: nfData,
            createdAt: nfData?.createdAt?.toDate(), // Converte o timestamp para objeto Date
          };
        }
        return null;
      })
    );

    // Filtrar as NFs válidas e encontrar a mais recente
    const validNFs = relatedNFsData.filter(
      (nfData) => nfData && nfData.createdAt
    );
    if (validNFs.length > 0) {
      // Ordenar as NFs pela data de criação em ordem decrescente
      validNFs.sort((a, b) => b.createdAt - a.createdAt);

      // Definir a data de criação da NF mais recente como lastExport
      nfLastExport = validNFs[0].createdAt.toLocaleDateString("pt-BR");
    }
  }

  return nfLastExport;
}

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

      logApi(apiServiceTitle, "Iniciando busca por clientes...");

      const collectionRef = collection(config.db, ACCOUNTANCIES_COLLECTION);
      const documentRef = doc(collectionRef, accountancyUid);
      const documentSnapshot = await getDoc(documentRef);

      let clientCompaniesData = [];

      if (documentSnapshot.exists()) {
        const relatedClientCompaniesRefs =
          documentSnapshot.data()?.relatedClientCompanies;

        if (relatedClientCompaniesRefs?.length > 0) {
          const clientCompaniesPromises = relatedClientCompaniesRefs.map(
            async (clientCompanyRef) => {
              const clientCompanySnapshot = await getDoc(clientCompanyRef);

              if (clientCompanySnapshot.exists()) {
                const clientCompanyData = clientCompanySnapshot.data();

                const certificateNearestDueDate = await getCertificateDueDate(
                  clientCompanyData.relatedCertificates
                );

                clientCompanyData.certificateNearestDueDate =
                  certificateNearestDueDate;

                const nfLastExport = await getNfLastExport(
                  clientCompanyData.relatedNFs
                );

                clientCompanyData.nfLastExport = nfLastExport;

                return clientCompanyData;
              }

              return null;
            }
          );

          const clientCompaniesSnapshots = await Promise.all(
            clientCompaniesPromises
          );

          clientCompaniesData = clientCompaniesSnapshots.filter(
            (data) => data !== null
          );
        }
      }

      const clientCompanyData = {
        uid: accountancyUid,
        clientCompaniesData,
      };

      const successMessage = "Busca de clientes realizada com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: clientCompanyData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
