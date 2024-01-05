const validateAccountCodeApi = require("./authentication/validate-account-api");
const sendValidationCodeApi = require("./authentication/send-validation-code-api");
const sendRecoveryPasswordEmailApi = require("./authentication/send-recovery-password-email-api");
const registerNewPasswordApi = require("./authentication/register-new-password-api");

module.exports = (app) => {
  /**
   * AUTHENTICATION
   */
  app.post("/validate-account", validateAccountCodeApi.call);
  app.post("/send-validation-code", sendValidationCodeApi.call);
  app.post("/send-recovery-password-email", sendRecoveryPasswordEmailApi.call);
  app.post("/register-new-password", registerNewPasswordApi.call);
};
