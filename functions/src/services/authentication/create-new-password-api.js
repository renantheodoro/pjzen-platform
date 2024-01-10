/**
 * Serviço Create-New-Password
 *
 * Este serviço é responsável por permitir a atualização da senha de um usuário no sistema. O serviço
 * opera principalmente com entidades relacionadas a contabilidades e utiliza o código de redefinição de senha
 * para garantir a segurança do processo.
 *
 * Parâmetros de Entrada:
 * - authorization (Header): Chave de autenticação para acessar o serviço.
 * - email: Endereço de e-mail associado ao usuário que deseja redefinir a senha.
 * - resetPasswordCode: Código de redefinição de senha enviado ao usuário.
 * - newPassword: Nova senha desejada para o usuário.
 *
 * Funcionamento do Serviço:
 * - Autenticação: O serviço requer uma chave de autorização (apiKey) para garantir acesso seguro.
 * - Obtendo UID: Utilizando o e-mail fornecido, o serviço obtém o UID do usuário no Firebase Authentication.
 * - Verificação do Código: Com o UID, o serviço compara o código de redefinição fornecido com o armazenado no banco de dados.
 * - Atualização da Senha: Se o código for válido, a senha do usuário é atualizada no Firebase Authentication.
 * - Limpeza do Código: Após a atualização bem-sucedida, o código de redefinição é limpo no banco de dados.
 * - Logs: Todas as ações do serviço são registradas por meio do módulo 'logApi'.
 * - Erros: Em caso de falha, o serviço utiliza o módulo 'errorHandler' para gerar uma resposta adequada.
 *
 * Nota: O serviço também permite a verificação da nova senha em relação à anterior (comentado como TODO),
 * mas essa verificação pode ser habilitada conforme os requisitos específicos do sistema.
 *
 * Exemplo de Uso:
 * ```
 * POST /create-new-password
 * Headers: { authorization: 'API_KEY' }
 * Body: {
 *   email: 'john.doe@example.com',
 *   resetPasswordCode: 123456,
 *   newPassword: 'newSecurePassword123'
 * }
 * ```
 */

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
