const config = require("../../firebase/firebase-config");
const { logApi } = require("../../data/log-api");
const {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} = require("firebase/firestore");
const errorHandler = require("../../data/error-handler");
const {
  CLIENT_COMPANIES_COLLECTION,
  ACCOUNTANCIES_COLLECTION,
} = require("../../data/collections");
const { getCleanCNPJ } = require("../common/get-clean-cnpj");
const validateRequest = require("../common/validate-request");
const { decrypt } = require("../common/encrypt");

const apiServiceTitle = "CREATE CLIENT COMPANY";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const {
      accountancyUid,
      entityType,
      cnpj,
      businessName,
      tradeName,
      cnae,
      foundationDate,
      taxRegime,
      companyOffering,
      municipalRegistration,
      address,
      email,
      comercialPhone,
    } = req.body;

    const decryptedCNPJ = decrypt(cnpj);
    const decryptedMunicipalRegistration = decrypt(municipalRegistration);

    try {
      if (!accountancyUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando cadastro de empresa...");

      const companyData = {
        entityType,
        cnpj: getCleanCNPJ(decryptedCNPJ),
        businessName,
        tradeName,
        cnae,
        foundationDate,
        taxRegime,
        companyOffering,
        municipalRegistration: decryptedMunicipalRegistration,
        address: {
          zipcode: address.zipcode,
          street: address.street,
          number: address.number,
          complement: address.complement,
          city: address.city,
          neighborhood: address.neighborhood,
        },
        email,
        comercialPhone,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      };

      const accountancyReference = doc(
        config.db,
        ACCOUNTANCIES_COLLECTION,
        accountancyUid
      );

      companyData.accountancyReference = accountancyReference;

      await setDoc(
        doc(
          config.db,
          CLIENT_COMPANIES_COLLECTION,
          getCleanCNPJ(decryptedCNPJ)
        ),
        companyData
      );

      const clientCompanyReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        getCleanCNPJ(decryptedCNPJ)
      );

      await updateDoc(accountancyReference, {
        relatedClientCompanies: arrayUnion(clientCompanyReference),
      });

      const clientCompanyData = {
        uid: accountancyUid,
        companyData,
      };

      const successMessage = "Cadastro de empresa realizado com sucesso!";
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
