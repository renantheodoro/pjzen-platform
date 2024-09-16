const admin = require("../../../firebase/firebase-admin");
const errorHandler = require("../../../data/error-handler");
const nodemailer = require("nodemailer");
const {
  PROFILES_ACCOUNT_COLLECTION,
  ACCOUNTANCIES_COLLECTION,
} = require("../../../data/collections");
const { logApi } = require("../../../data/log-api");
const validateRequest = require("../../common/validate-request");
const {
  PROFILE_INVITE_STATUS_SENT,
} = require("../../../data/profile-invite-status");

const apiServiceTitle = "FIREBASE SEND PROFILE INVITE EMAIL";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    logApi(apiServiceTitle, "Iniciando envio de convite para colaborador...");

    const { accountancyUid, accountancyName, email, permission } = req.body;

    try {
      // 1. Verificar se o e-mail já está em uso
      const profileSnapshot = await admin
        .firestore()
        .collection(PROFILES_ACCOUNT_COLLECTION)
        .where("email", "==", email)
        .get();

      if (!profileSnapshot.empty) {
        throw "profile/email-already-exists";
      }

      // 2. Criar documento no Firestore usando PROFILES_ACCOUNT_COLLECTION como nome da coleção
      const accountancyRef = await admin
        .firestore()
        .collection(ACCOUNTANCIES_COLLECTION)
        .doc(accountancyUid);

      const profileRef = await admin
        .firestore()
        .collection(PROFILES_ACCOUNT_COLLECTION)
        .add({
          email,
          permission,
          accountancyReference: accountancyRef,
          authenticationData: {
            invitationAcceptanceStatus: PROFILE_INVITE_STATUS_SENT,
          },
        });

      const profileUid = profileRef.id;

      // 3. Criar um link personalizado que inclua o UID e o código de redefinição
      const baseUrl = `https://pjzen-plataform-dev.web.app/criar-conta-de-colaborador`;

      const customLink = `${baseUrl}?email=${encodeURIComponent(
        email.trim()
      )}&accountancyUid=${encodeURIComponent(
        accountancyUid
      )}&profileUid=${encodeURIComponent(profileUid)}`;

      // 4. Enviar e-mail de convite
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODE_MAILER_EMAIL,
          pass: process.env.NODE_MAILER_PASS,
        },
      });

      const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: "Convite de colaboração",
        html: `
          <div style="background-color: #fff;  padding: 14px 20px; border-radius: 8px; padding: 28px; border: 1px solid #eeeeee;">
            <h2 style="font-size: 18px; margin-bottom: 20px; color: #353535;">Convite de colaboração</h2>
            <p style="font-size: 16px; color: #353535;">Você foi convidado a colaborar com a contabilidade <strong>${accountancyName}</strong>.</p>
            <p style="font-size: 16px; color: #353535;">Clique no botão abaixo para criar sua conta de colaborador:</p>
            <a href="${customLink}" style="background-color: #ee783c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">Criar conta de colaborador</a>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logApi(apiServiceTitle, "Erro ao enviar convite por e-mail:", error);
        } else {
          logApi(
            apiServiceTitle,
            `Convite enviado para o e-mail com sucesso: ${info.response}`
          );
        }
      });

      const successMessage = "Convite enviado com sucesso!";
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
