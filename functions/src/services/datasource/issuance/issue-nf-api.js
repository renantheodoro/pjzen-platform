const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const {
  CLIENT_COMPANIES_COLLECTION,
  CLIENT_NF_COLLECTION,
} = require("../../../data/collections");
const {
  NF_STATUS_AWAITING_RETURN,
  PLUG_NOTAS_STATUS_CONCLUIDO,
  NF_STATUS_COMPLETED,
} = require("../../../data/nf-status");
const validateRequest = require("../../common/validate-request");
const issueInvoiceApi = require("../../plug-notas-api/issuance/issue-invoice-api");
const getInvoiceByNfIdApi = require("../../plug-notas-api/issuance/get-invoice-by-nf-id-api");

const apiServiceTitle = "ISSUE NF SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    let {
      companyUid,
      takerReference,
      serviceReference,
      sellingValue,
      sellingDate,
      // category,
      // itemDetails,
      quantity,
      unityValue,
      total,
      totalWithDiscounts,
      // discount,
      operationNature,
      observations,
      // description,
      rps,
      rpsSerie,
      rpsDate,
      rpsDueDate,
      iss,
      importMethod,
    } = req.body;

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      logApi(apiServiceTitle, "Iniciando emissão de nota fiscal...");

      // Converter as referências em string para referências de documentos
      const takerDocRef = doc(config.db, takerReference);
      const serviceDocRef = doc(config.db, serviceReference);

      // Obter os dados dos documentos usando as referências
      const takerDocSnap = await getDoc(takerDocRef);
      const serviceDocSnap = await getDoc(serviceDocRef);

      // Verificar se os documentos existem e extrair os dados, se disponíveis
      let takerData = null;
      let serviceData = null;

      if (takerDocSnap.exists()) {
        takerData = takerDocSnap.data();
      } else {
        throw "error/not-found";
      }

      if (serviceDocSnap.exists()) {
        serviceData = serviceDocSnap.data();
      } else {
        throw "error/not-found";
      }

      const issueNfData = {
        companyUid,
        taker: takerData,
        service: serviceData,
        sellingValue,
        sellingDate,
        // category,
        // itemDetails,
        quantity,
        unityValue,
        total,
        totalWithDiscounts,
        // discount,
        operationNature,
        observations,
        // description,
        rps,
        rpsSerie,
        rpsDate,
        rpsDueDate,
        iss,
        importMethod,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
        status: NF_STATUS_AWAITING_RETURN,
      };

      /* REGISTER COMPANY PLUG NOTAS */
      const plugNotasResponse = await issueInvoiceApi.call(issueNfData);

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      const companyReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        companyUid
      );

      issueNfData.plugNotasNfData = plugNotasResponse.data;

      const nfId = plugNotasResponse.data.nfId;

      const nfPlugNotasResponse = await getInvoiceByNfIdApi.call(nfId);

      if (!nfPlugNotasResponse.data) {
        return res.status(nfPlugNotasResponse.status).send(nfPlugNotasResponse);
      }

      const nfStatus =
        nfPlugNotasResponse.data.status === PLUG_NOTAS_STATUS_CONCLUIDO
          ? NF_STATUS_COMPLETED
          : issueNfData.status;

      issueNfData.status = nfStatus;

      /* CREATE CLIENT NF FIREBASE */
      issueNfData.companyReference = companyReference;
      issueNfData.takerReference = takerReference;
      issueNfData.serviceReference = serviceReference;

      await setDoc(doc(config.db, CLIENT_NF_COLLECTION, nfId), issueNfData);

      const nfReference = doc(config.db, CLIENT_NF_COLLECTION, nfId);

      await updateDoc(companyReference, {
        relatedNFs: arrayUnion(nfReference),
      });

      await updateDoc(takerDocRef, {
        relatedNFs: arrayUnion(nfReference),
      });

      const nfData = {
        nfId,
        issueNfData,
        companyUid,
      };

      const successMessage =
        "Processo de emissão de nota fiscal realizado com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: nfData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
