const admin = require("../../firebase/firebase-admin");
const getDocumentByIdApi = require("../common/get-document-by-id");
const { logApi } = require("../../data/log-api");
const errorHandler = require("../../data/error-handler");
const { ACCOUNTANCIES_COLLECTION } = require("../../data/collections");
const validateRequest = require("../common/validate-request");
const { decrypt } = require("../common/encrypt");

const apiServiceTitle = "CREATE NEW PASSWORD SERVICE";

const getStoredResetPasswordCode = async (documentId) => {
  const snapshot = await getDocumentByIdApi(
    documentId,
    ACCOUNTANCIES_COLLECTION
  );
  return snapshot?.authenticationData?.resetPasswordCode;
};

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw Error("unauthorized");
    }

    const { email, resetPasswordCode, newPassword } = req.body;

    logApi(apiServiceTitle, "Iniciando atualização de senha...");

    try {
      // Obter o UID do usuário pelo e-mail
      const userRecord = await admin.auth().getUserByEmail(email.trim());
      const uid = userRecord.uid;

      // Obter o código de redefinição de senha
      const storedResetPasswordCode = await getStoredResetPasswordCode(uid);

      if (storedResetPasswordCode !== parseInt(resetPasswordCode)) {
        throw new Error("Código de redefinição de senha inválido.");
      }

      // TODO: se for requisito, precisa adicionar essa verificação, mas nao tinha conseguido antes
      // Verificar se a nova senha é a mesma que a anterior
      //   if (newPassword === userRecord.password) {
      //     throw new Error("A nova senha não pode ser a mesma que a anterior.");
      //   }

      console.log("--- newPassword", newPassword);

      const decryptedPassword = decrypt(newPassword);

      // Atualizar a senha do usuário no Firebase
      await admin.auth().updateUser(uid, {
        password: decryptedPassword,
      });

      // Limpar o código de redefinição após o uso
      const userDocRef = admin
        .firestore()
        .collection(ACCOUNTANCIES_COLLECTION)
        .doc(uid);

      await userDocRef.update({
        "authenticationData.resetPasswordCode": -1,
      });

      const successMessage = "Senha atualizada com sucesso!";
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
