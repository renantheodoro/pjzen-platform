const admin = require("../../../firebase/firebase-admin");
const { logApi } = require("../../../data/log-api");
const errorHandler = require("../../../data/error-handler");

const apiServiceTitle = "VERIFY TOKEN";

module.exports = {
  async call(req, res) {
    const { token } = req.body;

    logApi(apiServiceTitle, "Iniciando verificação do token...");

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Renovação da sessão do usuário
      const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 dias
      const sessionCookie = await admin
        .auth()
        .createSessionCookie(token, { expiresIn });

      const successMessage = "A sessão do usuário foi renovada com sucesso.";

      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: {
          sessionCookie,
          decodedToken,
        },
      });
    } catch (error) {
      const { status, message } = errorHandler(error, apiServiceTitle);
      res.status(status).send(message);
    }
  },
};
