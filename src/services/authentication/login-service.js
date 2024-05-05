import {
  setAccountancyDataToLocalStorage,
  setProfileDataToLocalStorage,
  setUserSessionStorage,
} from "@/helpers/local-storage";
import { setTokenToSessionStorage } from "@/helpers/session-storage";
import { errorLog } from "@/helpers/log";

import { auth } from "@/services/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import getAccoutancyService from "./get-accountancy-service";
import getProfileDataService from "./get-profile-data-service";
import {
  USER_SESSION_ACCOUNTANCY_TYPE,
  USER_SESSION_PROFILE_TYPE,
} from "@/data/const/user-session-type";

const handleLogin = async function (email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    let errorMessage = "Erro desconhecido ao realizar login";

    switch (error.code) {
      case "auth/invalid-email":
      case "auth/invalid-credential":
      case "auth/wrong-password":
        errorMessage = "Dados incorretos. Tente novamente";
        break;
      case "auth/user-disabled":
        errorMessage = "Usuário desativado";
        break;
      case "auth/user-not-found":
        errorMessage = "Usuário não encontrado";
        break;
      default:
        errorMessage = `Ocorreu um erro inesperado: ${error}`;
    }

    throw errorMessage;
  }
};

export default async (data) => {
  try {
    const { email, password } = data;

    if (!email || typeof email !== "string") {
      throw "O campo 'email' é obrigatório e deve ser uma string.";
    }

    if (!password || typeof password !== "string") {
      throw "O campo 'password' é obrigatório e deve ser uma string.";
    }

    const response = await handleLogin(email, password);

    const { accessToken, uid } = response;

    const userSession = {
      email,
      accessToken,
      uid,
    };

    setTokenToSessionStorage(accessToken);

    setAccountancyDataToLocalStorage("");
    setProfileDataToLocalStorage("");
    setUserSessionStorage("");

    try {
      const accountancyResponse = await getAccoutancyService(uid);
      setAccountancyDataToLocalStorage(accountancyResponse.data);
      userSession.sessionType = USER_SESSION_ACCOUNTANCY_TYPE;
    } catch (error) {
      const profileAccount = await getProfileDataService(uid);
      console.log("profileAccount", profileAccount);
      if (!profileAccount.data.isActive) {
        throw "Usuário sem permissão de entrar";
      }

      setAccountancyDataToLocalStorage(profileAccount.data.accountancyData);
      setProfileDataToLocalStorage(profileAccount.data);
      userSession.sessionType = USER_SESSION_PROFILE_TYPE;
    }

    setUserSessionStorage(userSession);

    return response.data;
  } catch (error) {
    let errorMessage;

    if (error?.response?.data?.message) {
      errorMessage = error?.response?.data?.message;
    } else if (error) {
      errorMessage = error;
    }

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`LOGIN: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
