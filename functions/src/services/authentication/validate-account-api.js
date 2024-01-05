const admin = require("../../firebase/firebase-admin");
const { log, error } = require("firebase-functions/logger");
const { ACCOUNTANCIES_COLLECTION } = require("../../data/collections");

module.exports = {
  async getStoredCode(uid) {
    try {
      const snapshot = await admin
        .firestore()
        .collection(ACCOUNTANCIES_COLLECTION)
        .doc(uid)
        .get();

      return snapshot.data()?.validationCode;
    } catch (error) {
      throw new Error(
        `Erro ao obter código armazenado para UID ${uid}: ${error.message}`
      );
    }
  },

  async markEmailAsVerified(uid) {
    try {
      return await admin.auth().updateUser(uid, { emailVerified: true });
    } catch (error) {
      throw new Error(
        `Erro ao marcar e-mail como verificado para UID ${uid}: ${error.message}`
      );
    }
  },

  async clearValidationCode(uid) {
    try {
      const firestore = admin.firestore();
      const docRef = firestore.collection(ACCOUNTANCIES_COLLECTION).doc(uid);

      await docRef.update({
        validationCode: -1, // Atualiza o valor para -1
      });

      log(
        `Propriedade validationCode atualizada para -1 com sucesso para o documento com UID ${uid}`
      );
    } catch (error) {
      error(
        `Erro ao atualizar a propriedade validationCode para -1 no documento com UID ${uid}:`,
        error
      );
    }
  },

  async call(req, res) {
    log(
      "[API] FIREBASE VALIDATE ACCOUNT SERVICE -> Iniciando validação de código..."
    );

    try {
      const { uid, validationCode } = req.body;

      // Validações dos campos dentro do objeto form
      if (!uid || typeof uid !== "string") {
        throw new Error("O valor 'uid' não é válido.");
      }

      if (!validationCode || isNaN(Number(validationCode))) {
        throw new Error("O valor 'validationCode' não é válido.");
      }

      // Obter o código de verificação do Firestore
      const storedCode = await module.exports.getStoredCode(uid);

      // Verificar se o código inserido pelo usuário é válido
      if (validationCode === storedCode) {
        // Marcar o e-mail como verificado no Firebase Authentication
        await module.exports.markEmailAsVerified(uid);

        // Limpar o código de verificação no Firestore
        const validationCodeDeleteResponse =
          await module.exports.clearValidationCode(uid);

        log("validationCodeDeleteResponse", validationCodeDeleteResponse);

        log(
          "[API] FIREBASE VALIDATE ACCOUNT SERVICE -> E-mail verificado com sucesso!"
        );

        res.status(200).send({
          success: {
            message: "Conta validada com sucesso!",
            statusCode: 200,
          },
        });
      } else {
        throw Error("Ocorreu um erro durante a validação da conta.");
      }
    } catch (e) {
      error(`[API] FIREBASE VALIDATE ACCOUNT SERVICE -> ${e}`);

      res.status(500).send({
        error: {
          statusCode: 500,
          message:
            "Não foi possível validar o código de verificação. Ocorreu um erro desconhecido.",
          e: e,
        },
      });
    }
  },
};
