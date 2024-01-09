const verifyTokenApi = require("./authentication/verify-token-api");
const createAccountancyApi = require("./authentication/create-accountancy-api");
const validateAccountCodeApi = require("./authentication/validate-account-api");
const sendValidationCodeApi = require("./authentication/send-validation-code-api");
const sendRecoveryPasswordEmailApi = require("./authentication/send-recovery-password-email-api");
const createNewPasswordApi = require("./authentication/create-new-password-api");

module.exports = (app) => {
  /**
   * AUTHENTICATION
   */
  app.post("/verify-token", verifyTokenApi.call);
  app.post("/create-accountancy", createAccountancyApi.call);
  app.post("/validate-account", validateAccountCodeApi.call);
  app.post("/send-validation-code", sendValidationCodeApi.call);
  app.post("/send-recovery-password-email", sendRecoveryPasswordEmailApi.call);
  app.post("/create-new-password", createNewPasswordApi.call);
};
