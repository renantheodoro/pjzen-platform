const admin = require("../../firebase/firebase-admin");
const errorHandler = require("../../data/error-handler");
const { logApi } = require("../../data/log-api");

const apiServiceTitle = "GET DOCUMENT BY ID";

const getDocumentById = async (documentId, collectionName) => {
  logApi(
    apiServiceTitle,
    `Iniciando busca do documento pelo documentId: ${documentId}`
  );

  try {
    const snapshot = await admin
      .firestore()
      .collection(collectionName)
      .doc(documentId)
      .get();
    return snapshot.data();
  } catch (error) {
    throw errorHandler(error, apiServiceTitle);
  }
};

module.exports = getDocumentById;
