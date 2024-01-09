const admin = require("../../firebase/firebase-admin");
const errorHandler = require("../../data/error-handler");
const nodemailer = require("nodemailer");
const { ACCOUNTANCIES_COLLECTION } = require("../../data/collections");
const { logApi } = require("../../data/log-api");
const validateRequest = require("../common/validate-request");

const apiServiceTitle = "FIREBASE SEND VALIDATION CODE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw Error("unauthorized");
    }

    const { documentId, email } = req.body;

    logApi(apiServiceTitle, "Iniciando envio de código de validação...");

    const validationCode = Math.floor(10000 + Math.random() * 90000);

    try {
      const userDocRef = admin
        .firestore()
        .collection(ACCOUNTANCIES_COLLECTION)
        .doc(documentId);

      await userDocRef.update({
        "authenticationData.validationCode": validationCode,
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "renan.b.theodoro@gmail.com", // TODO: adicionar o e-mail real
          pass: "gsle zfwh kflu usmw", // TODO: adicionar o password real
        },
      });

      const mailOptions = {
        from: "pjzen@email.com",
        to: email,
        subject: "Código de Verificação",
        text: `Seu código de verificação é: ${validationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erro ao enviar o e-mail:", error);
        } else {
          console.log("E-mail enviado com sucesso:", info.response);
        }
      });

      const successMessage = "Código enviado com sucesso!";
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
