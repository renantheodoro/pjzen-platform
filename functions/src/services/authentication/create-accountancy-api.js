const admin = require("../../firebase/firebase-admin");
const config = require("../../firebase/firebase-config");
const { logApi } = require("../../data/log-api");
const { doc, setDoc, serverTimestamp } = require("firebase/firestore");
const errorHandler = require("../../data/error-handler");
const { ACCOUNTANCIES_COLLECTION } = require("../../data/collections");
const { getCleanCNPJ } = require("../common/get-clean-cnpj");
const validateRequest = require("../common/validate-request");
const { decrypt } = require("../common/encrypt");

const apiServiceTitle = "CREATE ACCOUNTANCY SERVICE";

const createAuthentication = async (email, password) => {
  const user = await admin.auth().createUser({
    email,
    password,
  });
  return user;
};

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw Error("unauthorized");
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      company,
      cnpj,
      clientsNumber,
      serviceType,
    } = req.body;

    const decryptedPassword = decrypt(password);
    const decryptedCNPJ = decrypt(cnpj);

    try {
      logApi(apiServiceTitle, "Iniciando cadastro de usuário...");

      const userData = await createAuthentication(email, decryptedPassword);

      logApi(
        apiServiceTitle,
        "Cadastro de usuário realizado com sucesso!",
        userData
      );

      logApi(
        apiServiceTitle,
        "Iniciando cadastro de contabilidade no banco de dados..."
      );

      const accountancyData = {
        uid: userData.uid,
        firstName,
        lastName,
        email,
        phone,
        company,
        cnpj: getCleanCNPJ(decryptedCNPJ),
        clientsNumber,
        serviceType,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      };

      await setDoc(
        doc(config.db, ACCOUNTANCIES_COLLECTION, userData.uid),
        accountancyData
      );

      const response = {
        userData,
        accountancyData,
      };

      const successMessage = "Cadastro realizado com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: response,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
