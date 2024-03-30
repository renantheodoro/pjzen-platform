const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, updateDoc, serverTimestamp } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { CLIENT_COMPANIES_COLLECTION } = require("../../../data/collections");
const { getCleanCNPJ } = require("../../../helpers/get-clean-cnpj");
const validateRequest = require("../../common/validate-request");
const { decrypt } = require("../../common/encrypt");
const updateCompanyByCnpjApi = require("../../plug-notas-api/company/update-company-by-cnpj-api");

const apiServiceTitle = "UPDATE CLIENT COMPANY";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;
    const companyUid = req.params.companyUid;

    const {
      cnpj,
      address,
      comercialPhone,
      tradeName,
      businessName,
      taxRegime,
      municipalRegistration,
      email,
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
        cnpj,
        address,
        comercialPhone,
        tradeName,
        businessName,
        taxRegime,
        municipalRegistration,
        email,
        lastModifiedAt: serverTimestamp(), // Atualiza o campo de data de modificação
      };

      /* UPDATE COMPANY PLUG NOTAS */
      const plugNotasResponse = await updateCompanyByCnpjApi.call({
        cnpj: getCleanCNPJ(decryptedCNPJ),
        address,
        comercialPhone,
        tradeName,
        businessName,
        taxRegime,
        decryptedMunicipalRegistration,
        email,
      });

      if (!plugNotasResponse.data) {
        return res.status(plugNotasResponse.status).send(plugNotasResponse);
      }

      companyData.plugNotasCompanyData = plugNotasResponse.data;

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
