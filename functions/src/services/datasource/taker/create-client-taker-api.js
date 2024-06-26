const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const {
  CLIENT_COMPANIES_COLLECTION,
  CLIENT_TAKER_COLLECTION,
} = require("../../../data/collections");
const { getCleanDocument } = require("../../../helpers/get-clean-document");
const validateRequest = require("../../common/validate-request");
const { decrypt } = require("../../common/encrypt");
const registerTakerService = require("../../plug-notas-api/taker/register-taker-api");

const apiServiceTitle = "CREATE CLIENT TAKER";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    let {
      companyUid,
      cpfCnpj,
      businessName,
      municipalRegistration,
      address,
      phone,
      email,
    } = req.body;

    let decryptedCpfCnpj;
    let decryptedMunicipalRegistration;

    if (apiKey === process.env.API_KEY_DEV) {
      decryptedCpfCnpj = cpfCnpj;
      decryptedMunicipalRegistration = municipalRegistration;
    } else {
      decryptedCpfCnpj = decrypt(cpfCnpj);
      decryptedMunicipalRegistration = municipalRegistration
        ? decrypt(municipalRegistration)
        : null;
    }

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!companyUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando cadastro de tomador...");

      const takerData = {
        cpfCnpj: getCleanDocument(decryptedCpfCnpj),
        businessName,
        municipalRegistration: decryptedMunicipalRegistration ?? null,
        address: {
          zipcode: address.zipcode,
          street: address.street,
          number: address.number,
          complement: address.complement,
          city: address.city,
          neighborhood: address.neighborhood,
          uf: address.uf,
        },
        phone,
        email,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
        isActive: true,
      };

      /* REGISTER COMPANY PLUG NOTAS */
      const plugNotasResponse = await registerTakerService.call(takerData);

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      takerData.plugNotasTakerData = plugNotasResponse.data;

      /* CREATE CLIENT TAKER FIREBASE */
      const companyReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        companyUid
      );

      takerData.companyReference = companyReference;

      await setDoc(
        doc(
          config.db,
          CLIENT_TAKER_COLLECTION,
          getCleanDocument(decryptedCpfCnpj)
        ),
        takerData
      );

      const clientTakerReference = doc(
        config.db,
        CLIENT_TAKER_COLLECTION,
        getCleanDocument(decryptedCpfCnpj)
      );

      await updateDoc(companyReference, {
        relatedClientTakers: arrayUnion(clientTakerReference),
      });

      const clientTakerData = {
        companyUid: companyUid,
        takerId: clientTakerReference.id,
        takerCpfCnpj: decryptedCpfCnpj,
        takerData,
      };

      const successMessage = "Cadastro de tomador realizado com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: clientTakerData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
