const admin = require("../../firebase/firebase-admin");
const { log, error } = require("firebase-functions/logger");
const { ACCOUNTANCIES_COLLECTION } = require("../../data/collections");

module.exports = {
  async getStoredResetPasswordCode(uid) {
    try {
      const snapshot = await admin
        .firestore()
        .collection(ACCOUNTANCIES_COLLECTION)
        .doc(uid)
        .get();

      return snapshot.data()?.authenticationData.resetPasswordCode;
    } catch (error) {
      throw new Error(
        `Erro ao obter código armazenado para UID ${uid}: ${error.message}`
      );
    }
  },

  async setStoredResetPasswordCode(uid, resetCode) {
    try {
      const userDocRef = admin
        .firestore()
        .collection(ACCOUNTANCIES_COLLECTION)
        .doc(uid);

      await userDocRef.set(
        {
          "authenticationData.resetPasswordCode": resetCode,
        },
        { merge: true }
      );

      console.log(`Código de redefinição de senha atualizado para UID ${uid}`);
    } catch (error) {
      throw new Error(
        `Erro ao definir código armazenado para UID ${uid}: ${error.message}`
      );
    }
  },

  async call(req, res) {
    const { email, resetPasswordCode, newPassword } = req.body;

    log(
      "[API] REGISTER NEW PASSWORD SERVICE -> Iniciando atualização de senha..."
    );

    try {
      // Obter o UID do usuário pelo e-mail
      const userRecord = await admin.auth().getUserByEmail(email.trim());
      const uid = userRecord.uid;

      // Obter o código de redefinição de senha
      const storedResetPasswordCode =
        await module.exports.getStoredResetPasswordCode(uid);

      if (storedResetPasswordCode !== parseInt(resetPasswordCode)) {
        throw new Error("Código de redefinição de senha inválido.");
      }

      // TODO: se for requisito, precisa adicionar essa verificação, mas nao tinha conseguido antes
      // Verificar se a nova senha é a mesma que a anterior
      //   if (newPassword === userRecord.password) {
      //     throw new Error("A nova senha não pode ser a mesma que a anterior.");
      //   }

      // Atualizar a senha do usuário no Firebase
      await admin.auth().updateUser(uid, {
        password: newPassword,
      });

      // Limpar o código de redefinição após o uso
      await module.exports.setStoredResetPasswordCode(uid, -1);

      log(
        "[API] REGISTER NEW PASSWORD SERVICE -> Senha atualizada com sucesso!"
      );
      res.status(200).send("Senha atualizada com sucesso!");
    } catch (e) {
      if (e.code === "auth/weak-password") {
        // Cenário em que a nova senha é considerada fraca
        error(
          "[API] REGISTER NEW PASSWORD SERVICE -> Erro ao atualizar a senha: Nova senha fraca."
        );
        res
          .status(400)
          .send("A nova senha é muito fraca. Escolha uma senha mais forte.");
      } else {
        // Outros cenários de erro
        error(
          "[API] REGISTER NEW PASSWORD SERVICE -> Erro ao atualizar a senha:",
          e.message
        );
        res.status(500).send("Erro ao atualizar a senha.");
      }
    }
  },
};
