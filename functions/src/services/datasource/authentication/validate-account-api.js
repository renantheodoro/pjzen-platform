/**
 * Serviço Firebase-Validate-Account
 *
 * Este serviço é responsável por validar o código de verificação enviado por e-mail
 * durante o processo de criação da conta. Ele verifica se o código inserido pelo usuário
 * corresponde ao código armazenado no banco de dados associado à conta.
 *
 * Parâmetros de Entrada:
 * - authorization (Header): Chave de autenticação para acessar o serviço.
 * - documentId: Identificador único associado ao usuário no banco de dados.
 * - validationCode: Código de verificação enviado ao usuário por e-mail.
 *
 * Funcionamento do Serviço:
 * - Autenticação: O serviço requer uma chave de autorização (apiKey) para garantir acesso seguro.
 * - Validação de Parâmetros: Verifica se os parâmetros fornecidos são válidos.
 * - Obtendo Código Armazenado: Obtém o código de verificação armazenado no banco de dados.
 * - Comparação de Códigos: Compara o código inserido pelo usuário com o código armazenado.
 * - Marcar E-mail como Verificado: Caso os códigos correspondam, marca o e-mail como verificado no Firebase Authentication.
 * - Limpar Código de Verificação: Limpa o código de verificação armazenado no banco de dados.
 * - Logs: Todas as ações do serviço são registradas por meio do módulo 'logApi'.
 * - Erros: Em caso de falha, o serviço utiliza o módulo 'errorHandler' para gerar uma resposta adequada.
 *
 * Exemplo de Uso:
 * ```
 * POST /firebase-validate-account
 * Headers: { authorization: 'API_KEY' }
 * Body: {
 *   documentId: 'uniqueUserId',
 *   validationCode: 12345,
 * }
 * ```
 */

const admin = require("../../../firebase/firebase-admin");
const getDocumentByIdApi = require("../../common/get-document-by-id");
const { logApi } = require("../../../data/log-api");
const { ACCOUNTANCIES_COLLECTION } = require("../../../data/collections");
const errorHandler = require("../../../data/error-handler");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "FIREBASE VALIDATE ACCOUNT SERVICE";

const getStoredCode = async (documentId) => {
  const snapshot = await getDocumentByIdApi(
    documentId,
    ACCOUNTANCIES_COLLECTION
  );
  return snapshot?.authenticationData?.validationCode;
};

const markEmailAsVerified = async (documentId) => {
  return await admin.auth().updateUser(documentId, { emailVerified: true });
};

const clearValidationCode = async (documentId) => {
  const firestore = admin.firestore();
  const docRef = firestore.collection(ACCOUNTANCIES_COLLECTION).doc(documentId);

  await docRef.update({
    authenticationData: {
      isEmailVerified: true,
      validationCode: -1,
    },
  });

  logApi(
    apiServiceTitle,
    `Verificação de e-mail atualizada com sucesso! UID da operação: ${documentId}`
  );
};

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    try {
      logApi(apiServiceTitle, "Iniciando validação de código....");

      const { documentId, validationCode } = req.body;

      // Validações dos campos dentro do objeto form
      if (!documentId || typeof documentId !== "string") {
        throw new Error("O valor 'documentId' não é válido.");
      }

      if (!validationCode || isNaN(Number(validationCode))) {
        throw new Error("O valor 'validationCode' não é válido.");
      }

      // Obter o código de verificação do Firestore
      const storedCode = await getStoredCode(documentId);

      // Verificar se o código inserido pelo usuário é válido
      if (validationCode === storedCode) {
        // Marcar o e-mail como verificado no Firebase Authentication
        await markEmailAsVerified(documentId);

        // Limpar o código de verificação no Firestore
        const response = await clearValidationCode(documentId);

        const successMessage = "E-mail verificado com sucesso!";
        logApi(apiServiceTitle, successMessage);

        res.status(200).send({
          status: 200,
          message: successMessage,
          data: response,
        });
      } else {
        throw Error("invalid-code-verification");
      }
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
