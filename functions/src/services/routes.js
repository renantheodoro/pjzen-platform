const verifyTokenApi = require("./authentication/verify-token-api");
const createAccountancyApi = require("./authentication/create-accountancy-api");
const validateAccountCodeApi = require("./authentication/validate-account-api");
const sendValidationCodeApi = require("./authentication/send-validation-code-api");
const sendRecoveryPasswordEmailApi = require("./authentication/send-recovery-password-email-api");
const createNewPasswordApi = require("./authentication/create-new-password-api");
const createClientCompanyApi = require("./company/create-client-company-api");
const getClientCompanyListApi = require("./company/get-client-company-list-api");
const getClientByIdApi = require("./company/get-client-by-id-api");
const createClientServiceApi = require("./company/create-client-service-api");
const saveDigitalCertificateApi = require("./company/save-digital-certificate-api");
const getDigitalCertificateListApi = require("./company/get-digital-certificate-list-api");

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

  // GET

  /**
   * CLIENT COMPANY
   */

  // POST
  app.post("/create-client-company", createClientCompanyApi.call);
  app.post("/create-client-service", createClientServiceApi.call);
  app.post("/save-digital-certificate", saveDigitalCertificateApi.call);

  // GET
  app.get("/get-client-company-list", getClientCompanyListApi.call);
  app.get("/get-client-by-id", getClientByIdApi.call);
  app.get("/get-digital-certificate-list", getDigitalCertificateListApi.call);
};
