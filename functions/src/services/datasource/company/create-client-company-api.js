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
  ACCOUNTANCIES_COLLECTION,
} = require("../../../data/collections");
const { getCleanDocument } = require("../../../helpers/get-clean-document");
const validateRequest = require("../../common/validate-request");
const { decrypt } = require("../../common/encrypt");
// const registerCompanyService = require("../../plug-notas-api/company/register-company-api");

const apiServiceTitle = "CREATE CLIENT COMPANY";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    let {
      accountancyUid,
      entityType,
      isActive,
      cpfCnpj,
      businessName,
      tradeName,
      cnae,
      foundationDate,
      taxRegime,
      companyOffering,
      municipalRegistration,
      address,
      email,
      phone,
      prefectureLogin,
      prefecturePassword,
    } = req.body;

    let decryptedCpfCnpj;
    let decryptedMunicipalRegistration;

    if (apiKey === process.env.API_KEY_DEV) {
      decryptedCpfCnpj = cpfCnpj;
      decryptedMunicipalRegistration = municipalRegistration;
    } else {
      decryptedCpfCnpj = decrypt(cpfCnpj);
      decryptedMunicipalRegistration = decrypt(municipalRegistration);
    }

    try {
      if (!validateRequest(apiKey)) {
        throw "unauthorized";
      }

      if (!accountancyUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando cadastro de empresa...");

      const companyData = {
        entityType,
        isActive,
        cpfCnpj: getCleanDocument(decryptedCpfCnpj),
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
          uf: address.uf,
        },
        email,
        phone,
        prefectureLogin,
        prefecturePassword,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      };

      const accountancyReference = doc(
        config.db,
        ACCOUNTANCIES_COLLECTION,
        accountancyUid
      );

      /* CREATE CLIENT COMPANY FIREBASE */
      companyData.accountancyReference = accountancyReference;

      await setDoc(
        doc(
          config.db,
          CLIENT_COMPANIES_COLLECTION,
          getCleanDocument(decryptedCpfCnpj)
        ),
        companyData
      );

      const clientCompanyReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        getCleanDocument(decryptedCpfCnpj)
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
