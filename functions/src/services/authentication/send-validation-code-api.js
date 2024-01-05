const admin = require("../../firebase/firebase-admin");
const nodemailer = require("nodemailer");
const { ACCOUNTANCIES_COLLECTION } = require("../../data/collections");

const { log, error } = require("firebase-functions/logger");

module.exports = {
  async call(req, res) {
    const { uid, email } = req.body;

    log(
      "[API] FIREBASE SEND VALIDATION CODE SERVICE -> Iniciando envio de código de validação..."
    );

    const validationCode = Math.floor(10000 + Math.random() * 90000);

    try {
      // Salvar o código no Firestore associado ao ID do usuário
      const userDocRef = admin
        .firestore()
        .collection(ACCOUNTANCIES_COLLECTION)
        .doc(uid);

      await userDocRef.update({
        "authenticationData.validationCode": validationCode,
      });

      // Criar um transporte de e-mail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "renan.b.theodoro@gmail.com",
          pass: "gsle zfwh kflu usmw",
        },
      });

      // Configurar as opções do e-mail
      const mailOptions = {
        from: "pjzen@email.com",
        to: email,
        subject: "Código de Verificação",
        text: `Seu código de verificação é: ${validationCode}`,
      };

      // Enviar o e-mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erro ao enviar o e-mail:", error);
        } else {
          console.log("E-mail enviado com sucesso:", info.response);
        }
      });

      log(
        "[API] FIREBASE SEND VALIDATION CODE SERVICE -> Código de verificação enviado com sucesso!"
      );

      res.status(200).send({
        success: {
          message: "Código enviado com sucesso!",
          statusCode: 200,
        },
      });
    } catch (e) {
      error(
        "[API] FIREBASE SEND VALIDATION CODE SERVICE -> Erro ao enviar código de verificação:",
        e
      );

      res.status(500).send({
        error: {
          statusCode: 500,
          message:
            "Não foi possível enviar o código de verificação. Ocorreu um erro desconhecido.",
          e: e,
        },
      });
    }
  },
};
