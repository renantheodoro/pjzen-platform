// GENERAL
const verifyTokenApi = require("./datasource/authentication/verify-token-api");

// FIREBASE
const createAccountancyApi = require("./datasource/authentication/create-accountancy-api");
const validateAccountCodeApi = require("./datasource/authentication/validate-account-api");
const sendValidationCodeApi = require("./datasource/authentication/send-validation-code-api");
const sendRecoveryPasswordEmailApi = require("./datasource/authentication/send-recovery-password-email-api");
const createNewPasswordApi = require("./datasource/authentication/create-new-password-api");
const sendProfileInviteApi = require("./datasource/authentication/send-profile-invite-api");
const createProfileAccountApi = require("./datasource/authentication/create-profile-account-api");
const updateProfileAccountApi = require("./datasource/authentication/update-profile-account-api");
const deleteProfileAccountApi = require("./datasource/authentication/delete-profile-api");
const getProfileApi = require("./datasource/authentication/get-profile-api");
const getProfileListApi = require("./datasource/authentication/get-profile-list-api");
const createClientCompanyApi = require("./datasource/company/create-client-company-api");
const updateClientCompanyApi = require("./datasource/company/update-client-company-api");
const createClientTakerApi = require("./datasource/taker/create-client-taker-api");
const updateClientTakerApi = require("./datasource/taker/update-client-taker-api");
const getClientCompanyListApi = require("./datasource/company/get-client-company-list-api");
const getClientByIdApi = require("./datasource/company/get-client-company-by-id-api");
const createClientServiceApi = require("./datasource/service/create-client-service-api");
const updateClientServiceApi = require("./datasource/service/update-client-service-api");
const deleteClientServiceApi = require("./datasource/service/delete-client-service-api");
const getClientServicesApi = require("./datasource/service/get-client-service-list-api");
const getClientNfListApi = require("./datasource/issuance/get-nf-list-api");
const saveDigitalCertificateApi = require("./datasource/certificate/save-digital-certificate-api");
const deleteClientTakerApi = require("./datasource/taker/delete-client-taker-by-document");
const issueNfApi = require("./datasource/issuance/issue-nf-api");
const getDigitalCertificateListApi = require("./datasource/certificate/get-digital-certificate-list-api");
const getClientTakerByDocument = require("./datasource/taker/get-client-taker-by-document");

// PLUG NOTAS (NF)
const registerCertificateApi = require("./plug-notas-api/certificate/register-digital-certificate-api");
const updateCertificateApi = require("./plug-notas-api/certificate/update-digital-certificate-api");
const getCertificateApi = require("./plug-notas-api/certificate/get-digital-certificate-api");
const getCertificateByIdApi = require("./plug-notas-api/certificate/get-digital-certificate-by-id-api");
const getCompanyListApi = require("./plug-notas-api/company/get-company-list-api");
const getCompanyByDocumentApi = require("./plug-notas-api/company/get-company-by-document-api");
const updateCompanyByDocumentApi = require("./plug-notas-api/company/update-company-by-document-api");
const registerCompanyApi = require("./plug-notas-api/company/register-company-api");
const issueInvoiceApi = require("./plug-notas-api/issuance/issue-invoice-api");
const getInvoiceByNfIdApi = require("./plug-notas-api/issuance/get-invoice-by-nf-id-api");
const getCancellationInvoiceByProtocolApi = require("./plug-notas-api/issuance/get-cancellation-invoice-by-protocol-api");
const cancelInvoiceApi = require("./plug-notas-api/issuance/cancel-invoice-api");
const downloadInvoicePdfApi = require("./plug-notas-api/issuance/download-invoice-pdf-api");
const registerTakerApi = require("./plug-notas-api/taker/register-taker-api");
const getTakerByDocumentApi = require("./plug-notas-api/taker/get-taker-by-document-api");
const updateTakerByDocumentApi = require("./plug-notas-api/taker/update-taker-by-document-api");
const deleteTakerByDocumentApi = require("./plug-notas-api/taker/delete-taker-api");
const registerServiceApi = require("./plug-notas-api/service/register-service-api");
const getServiceByIdApi = require("./plug-notas-api/service/get-service-by-id-api");
const updateServiceByIdApi = require("./plug-notas-api/service/update-service-by-id-api");
const deleteServiceByIdApi = require("./plug-notas-api/service/delete-service-api");
const downloadNfPdfApi = require("./datasource/issuance/download-nf-pdf-api");
const cancelNfApi = require("./datasource/issuance/cancel-nf-api");
const getCancellationNfApi = require("./datasource/issuance/get-cancellation-nf-api");
const getNfApi = require("./datasource/issuance/get-nf-api");
const getDigitalCertificateApi = require("./datasource/certificate/get-digital-certificate-api");
const searchCertificatesAboutExpireApi = require("./datasource/certificate/search-certificates-about-expire-api");
const getAccountancyByUidApi = require("./datasource/authentication/get-accountancy-by-uid-api");
const deleteCertificateApi = require("./datasource/certificate/delete-certificate-api");
const getClientTakerListApi = require("./datasource/taker/get-client-taker-list-api");

module.exports = (app) => {
  /**
   * AUTHENTICATION
   */

  // POST
  app.post("/verify-token", verifyTokenApi.call);
  app.post("/create-accountancy", createAccountancyApi.call);
  app.post("/validate-account", validateAccountCodeApi.call);
  app.post("/send-validation-code", sendValidationCodeApi.call);
  app.post("/send-recovery-password-email", sendRecoveryPasswordEmailApi.call);
  app.post("/create-new-password", createNewPasswordApi.call);
  app.post("/send-profile-invite", sendProfileInviteApi.call);
  app.post("/create-profile-account", createProfileAccountApi.call);
  app.post("/update-profile-account", updateProfileAccountApi.call);
  app.post("/delete-profile/:profileUid", deleteProfileAccountApi.call);

  /**
   * CLIENT COMPANY
   */

  // POST
  app.post("/create-client-company", createClientCompanyApi.call);
  app.post("/update-client-company/:companyUid", updateClientCompanyApi.call);
  app.post("/create-client-taker", createClientTakerApi.call);
  app.post("/update-client-taker", updateClientTakerApi.call);
  app.post("/create-client-service", createClientServiceApi.call);
  app.post("/update-client-service/:serviceUid", updateClientServiceApi.call);
  app.post("/delete-client-service/:serviceUid", deleteClientServiceApi.call);
  app.post("/save-digital-certificate", saveDigitalCertificateApi.call);
  app.post("/delete-certificate/:certificateId", deleteCertificateApi.call);
  app.post("/delete-client-taker/:cpfCnpj", deleteClientTakerApi.call);
  app.post("/issue-nf/", issueNfApi.call);
  app.post("/download-nf-pdf/", downloadNfPdfApi.call);
  app.post("/cancel-nf/", cancelNfApi.call);

  // GET
  app.get("/get-client-accountancy-by-uid", getAccountancyByUidApi.call);
  app.get("/get-client-company-list", getClientCompanyListApi.call);
  app.get("/get-client-company-by-id", getClientByIdApi.call);
  app.get("/get-digital-certificate-list", getDigitalCertificateListApi.call);
  app.get("/get-client-taker-list/:companyUid", getClientTakerListApi.call);
  app.get(
    "/get-client-taker-by-document/:cpfCnpj",
    getClientTakerByDocument.call
  );
  app.get("/get-client-services/:companyUid", getClientServicesApi.call);
  app.get("/get-nf-list", getClientNfListApi.call);
  app.get("/get-nf-by-id/:nfId", getNfApi.call);
  app.get("/get-cancellation-status-nf", getCancellationNfApi.call);
  app.get(
    "/get-certificate-by-id/:certificateId",
    getDigitalCertificateApi.call
  );
  app.get(
    "/search-certificates-about-expire/:companyUid",
    searchCertificatesAboutExpireApi.call
  );
  app.get("/get-profile", getProfileApi.call);
  app.get("/get-profile-list", getProfileListApi.call);

  /**
   * PLUG NOTAS
   */

  // GET
  app.get("/get-digital-certificate", getCertificateApi.call);
  app.get(
    "/get-digital-certificate-by-id/:certificateIdOrCpfCnpj",
    getCertificateByIdApi.call
  );
  app.get("/get-company-list", getCompanyListApi.call);
  app.get("/get-company-by-document/:cpfCnpj", getCompanyByDocumentApi.call);
  app.get("/get-invoice-by-nf-id/:nfId", getInvoiceByNfIdApi.call);
  app.get(
    "/get-cancellation-invoice-by-protocol/:cancellationProtocol",
    getCancellationInvoiceByProtocolApi.call
  );
  app.get("/download-nf-pdf/:nfId", downloadInvoicePdfApi.call);
  app.get("/get-taker-by-document/:cpfCnpj", getTakerByDocumentApi.call);
  app.get("/get-service-by-id/:serviceId", getServiceByIdApi.call);

  // POST
  app.post("/register-digital-certificate", registerCertificateApi.call);
  app.post("/register-company", registerCompanyApi.call);
  app.post("/issue-invoice", issueInvoiceApi.call);
  app.post("/cancel-invoice/:nfId", cancelInvoiceApi.call);
  app.post("/register-taker", registerTakerApi.call);
  app.post("/register-service", registerServiceApi.call);

  // PUT
  app.put(
    "/update-digital-certificate/:certificateId",
    updateCertificateApi.call
  );

  // DELETE
  app.delete(
    "/delete-digital-certificate/:certificateId",
    deleteCertificateApi.call
  );
  app.delete("/delete-taker/:cpfCnpj", deleteTakerByDocumentApi.call);
  app.delete("/delete-service/:serviceId", deleteServiceByIdApi.call);

  // PATCH
  app.patch(
    "/update-company-by-document/:cpfCnpj",
    updateCompanyByDocumentApi.call
  );
  app.patch(
    "/update-taker-by-document/:cpfCnpj",
    updateTakerByDocumentApi.call
  );
  app.patch("/update-service-by-id/:serviceId", updateServiceByIdApi.call);
};
