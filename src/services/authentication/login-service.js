import { setUserDataToLocalStorage } from "@/helpers/local-storage";
import { setTokenToSessionStorage } from "@/helpers/session-storage";
import { errorLog } from "@/helpers/log";

import { auth } from "@/services/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

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
      throw new Error("O campo 'email' é obrigatório e deve ser uma string.");
    }

    if (!password || typeof password !== "string") {
      throw new Error(
        "O campo 'password' é obrigatório e deve ser uma string."
      );
    }

    const response = await handleLogin(email, password);

    const { accessToken, emailVerified, uid, email: currentEmail } = response;

    const currentUserData = {
      uid,
      emailVerified,
      email: currentEmail,
    };

    setUserDataToLocalStorage(currentUserData);
    setTokenToSessionStorage(accessToken);

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
