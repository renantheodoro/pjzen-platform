const admin = require("../../../firebase/firebase-admin");
const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp,
  arrayUnion,
  deleteDoc,
} = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const {
  ACCOUNTANCIES_COLLECTION,
  PROFILES_ACCOUNT_COLLECTION,
} = require("../../../data/collections");
const validateRequest = require("../../common/validate-request");
const { decrypt } = require("../../common/encrypt");

const apiServiceTitle = "CREATE PROFILE ACCOUNT";

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
      throw "unauthorized";
    }

    const { accountancyUid, profileUid, firstName, lastName, email, password } =
      req.body;

    const decryptedPassword = decrypt(password);

    try {
      logApi(apiServiceTitle, "Iniciando cadastro de colaborador...");

      // Obter os dados do documento anterior da coleção PROFILES_ACCOUNT_COLLECTION
      const profileDoc = doc(
        collection(config.db, PROFILES_ACCOUNT_COLLECTION),
        profileUid
      );
      const profileSnapshot = await getDoc(profileDoc);
      if (!profileSnapshot.exists()) {
        throw `error/profile-not-found`;
      }
      const previousProfileData = profileSnapshot.data();

      // Excluir o documento anterior da coleção PROFILES_ACCOUNT_COLLECTION
      await deleteDoc(profileDoc);

      logApi(
        apiServiceTitle,
        "Excluído o documento anterior na coleção PROFILES_ACCOUNT_COLLECTION"
      );

      const authenticationData = await createAuthentication(
        email,
        decryptedPassword
      );

      logApi(
        apiServiceTitle,
        "Cadastro de colaborador realizado com sucesso!",
        authenticationData
      );

      logApi(
        apiServiceTitle,
        "Iniciando cadastro de colaborador no banco de dados..."
      );

      // Mesclar os dados anteriores com os novos
      const profileData = {
        uid: authenticationData.uid,
        isActive: true,
        firstName,
        lastName,
        email,
        accountancyReference: `accountacies/${accountancyUid}`,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
        ...previousProfileData, // Mescla com os dados anteriores
      };

      // Criar um novo documento na coleção PROFILES_ACCOUNT_COLLECTION com o mesmo UID
      const newProfileRef = doc(
        collection(config.db, PROFILES_ACCOUNT_COLLECTION),
        authenticationData.uid
      );

      await setDoc(newProfileRef, profileData);

      const accountancyRef = doc(
        collection(config.db, ACCOUNTANCIES_COLLECTION),
        accountancyUid
      );

      await updateDoc(accountancyRef, {
        relatedProfiles: arrayUnion(newProfileRef),
      });

      const response = {
        authenticationData,
        profileData,
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
