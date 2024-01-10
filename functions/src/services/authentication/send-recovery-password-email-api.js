const admin = require("../../firebase/firebase-admin");
const nodemailer = require("nodemailer");
const { ACCOUNTANCIES_COLLECTION } = require("../../data/collections");
const errorHandler = require("../../data/error-handler");
const { logApi } = require("../../data/log-api");
const validateRequest = require("../common/validate-request");

const apiServiceTitle = "SEND RECOVERY PASSWORD SERVICE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw Error("unauthorized");
    }

    logApi(
      apiServiceTitle,
      "Iniciando envio de e-mail de recuperação de senha..."
    );
    try {
      const { email } = req.body;

      // Gere um código de redefinição de senha manualmente
      const resetPasswordCode = Math.floor(
        100000000000000 + Math.random() * 900000000000000
      );

      // Obter o UID do usuário pelo e-mail
      const userRecord = await admin.auth().getUserByEmail(email.trim());
      const uid = userRecord.uid;

      // Salvar o código de redefinição de senha
      const userDocRef = admin
        .firestore()
        .collection(ACCOUNTANCIES_COLLECTION)
        .doc(uid);

      await userDocRef.update({
        "authenticationData.resetPasswordCode": resetPasswordCode,
      });

      // TODO: adicionar a base da url dinamica para podução
      const passwordRecoveryLink = `https://pjzen-plataform-dev.web.app/cadastrar-nova-senha`;

      // Crie um link personalizado que inclua o UID e o código de redefinição
      const customLink = `${passwordRecoveryLink}?email=${encodeURIComponent(
        email.trim()
      )}&resetPasswordCode=${encodeURIComponent(resetPasswordCode)}`;

      // Criar um transporte de e-mail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "renan.b.theodoro@gmail.com", // TODO: adicionar email real
          pass: "gsle zfwh kflu usmw", // TODO: adicionar pass real
        },
      });

      // Configurar as opções do e-mail
      const mailOptions = {
        from: "pjzen@email.com", // TODO: adicionar email real
        to: email,
        subject: "Recuperação de senha",
        text: `Clique no link a seguir para recuperar sua senha: \n ${customLink}`,
      };

      // Enviar o e-mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erro ao enviar o e-mail:", error);
        } else {
          console.log("E-mail enviado com sucesso:", info.response);
        }
      });

      const successMessage =
        "Um link de recuperação de senha foi enviado ao seu e-mail! Cheque sua caixa de entrada.";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
