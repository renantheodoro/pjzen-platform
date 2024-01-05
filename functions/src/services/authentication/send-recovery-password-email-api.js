const admin = require("../../firebase/firebase-admin");
const nodemailer = require("nodemailer");
const { log, error } = require("firebase-functions/logger");
const { ACCOUNTANCIES_COLLECTION } = require("../../data/collections");

module.exports = {
  async call(req, res) {
    const { email } = req.body;

    log(
      "[API] FIREBASE SEND RECOVERY PASSWORD SERVICE -> Iniciando envio de e-mail de recuperação de senha..."
    );

    // TODO: adicionar a base da url dinamica para produção
    const passwordRecoveryLink = "http://localhost:8080/cadastrar-nova-senha";

    try {
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

      // Crie um link personalizado que inclua o UID e o código de redefinição
      const customLink = `${passwordRecoveryLink}?email=${encodeURIComponent(
        email.trim()
      )}&resetPasswordCode=${encodeURIComponent(resetPasswordCode)}`;

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

      log(
        "[API] FIREBASE SEND RECOVERY PASSWORD SERVICE -> E-mail de recuperação de senha enviado com sucesso!"
      );

      res
        .status(200)
        .send(
          "Um link de recuperação de senha foi enviado ao seu e-mail. Cheque sua caixa de entrada."
        );
    } catch (e) {
      error(
        "[API] FIREBASE SEND RECOVERY PASSWORD SERVICE -> Erro ao enviar o e-mail de recuperação de senha:",
        e.message
      );
      res.status(500).send("Erro ao enviar o e-mail de recuperação de senha.");
    }
  },
};
