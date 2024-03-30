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
const { getCleanCNPJ } = require("../../../helpers/get-clean-cnpj");
const validateRequest = require("../../common/validate-request");
const { decrypt } = require("../../common/encrypt");
const registerCompanyService = require("../../plug-notas-api/company/register-company-api");

const apiServiceTitle = "CREATE CLIENT COMPANY";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    let {
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
      certificateId,
    } = req.body;

    let decryptedCNPJ;
    let decryptedMunicipalRegistration;

    if (apiKey === process.env.API_KEY_DEV) {
      decryptedCNPJ = cnpj;
      decryptedMunicipalRegistration = municipalRegistration;
    } else {
      decryptedCNPJ = decrypt(cnpj);
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
        cnpj: getCleanCNPJ(decryptedCNPJ),
        businessName,
        tradeName,
        cnae,
        foundationDate,
        taxRegime,
        companyOffering,
        municipalRegistration: decryptedMunicipalRegistration,
        certificateId,
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
        comercialPhone,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
        isActive: true,
      };

      /* REGISTER COMPANY PLUG NOTAS */
      const plugNotasResponse = await registerCompanyService.call(companyData);

      const accountancyReference = doc(
        config.db,
        ACCOUNTANCIES_COLLECTION,
        accountancyUid
      );

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      companyData.plugNotasCompanyData = plugNotasResponse.data;

      /* CREATE CLIENT COMPANY FIREBASE */
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
        plugNotasData: plugNotasResponse,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
