const admin = require("../../firebase/firebase-admin");
const { logApi } = require("../../data/log-api");
const errorHandler = require("../../data/error-handler");

const apiServiceTitle = "VERIFY TOKEN";

module.exports = {
  async call(req, res) {
    const { token } = req.body;

    logApi(apiServiceTitle, "Iniciando verificação do token...");

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      const successMessage = "O token atual é válido.";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: {
          token: decodedToken,
        },
      });

      return decodedToken;
    } catch (error) {
      const { status, message } = errorHandler(error, apiServiceTitle);
      res.status(status).send(message);
    }
  },
};
