const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, updateDoc, serverTimestamp } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../../data/collections");
const { getCleanDocument } = require("../../../helpers/get-clean-document");
const validateRequest = require("../../common/validate-request");
const { decrypt } = require("../../common/encrypt");
const updateCompanyByDocumentApi = require("../../plug-notas-api/company/update-company-by-document-api");

const apiServiceTitle = "UPDATE CLIENT COMPANY";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;
    const companyUid = req.params.companyUid;

    const {
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

      if (!companyUid) {
        throw "invalid-argument";
      }

      logApi(apiServiceTitle, "Iniciando atualização de empresa...");

      const clientCompanyReference = doc(
        config.db,
        CLIENT_COMPANIES_COLLECTION,
        companyUid
      );

      const companyData = {
        isActive,
        businessName,
        tradeName,
        cnae,
        foundationDate,
        taxRegime,
        companyOffering,
        municipalRegistration: decryptedMunicipalRegistration,
        address,
        phone,
        email,
        lastModifiedAt: serverTimestamp(), // Atualiza o campo de data de modificação
      };

      /* UPDATE COMPANY PLUG NOTAS */
      const plugNotasResponse = await updateCompanyByDocumentApi.call({
        cpfCnpj: getCleanDocument(decryptedCpfCnpj),
        address,
        phone,
        tradeName,
        businessName,
        taxRegime,
        municipalRegistration: decryptedMunicipalRegistration,
        email,
      });

      if (plugNotasResponse?.data) {
        companyData.plugNotasCompanyData = plugNotasResponse.data;
      }

      /* UPDATE CLIENT COMPANY FIREBASE */
      await updateDoc(clientCompanyReference, companyData);

      const successMessage = "Atualização de empresa realizada com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: companyData,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
