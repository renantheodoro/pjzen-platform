const admin = require("../../firebase/firebase-admin");
const getDocumentByIdApi = require("../common/get-document-by-id");
const { logApi } = require("../../data/log-api");
const { ACCOUNTANCIES_COLLECTION } = require("../../data/collections");
const errorHandler = require("../../data/error-handler");
const validateRequest = require("../common/validate-request");

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
      throw Error("unauthorized");
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
