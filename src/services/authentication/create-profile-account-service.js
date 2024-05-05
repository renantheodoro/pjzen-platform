import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { encrypt } from "@/helpers/encrypt";

export default async (data) => {
  try {
    const { accountancyUid, profileUid, firstName, lastName, email, password } =
      data;

    // Validações dos campos dentro do objeto form
    if (!accountancyUid || typeof accountancyUid !== "string") {
      throw "O valor 'accountancyUid' não é válido.";
    }

    if (!profileUid || typeof profileUid !== "string") {
      throw "O valor 'profileUid' não é válido.";
    }

    if (!firstName || typeof firstName !== "string") {
      throw "O valor 'firstName' não é válido.";
    }

    if (!lastName || typeof lastName !== "string") {
      throw "O valor 'lastName' não é válido.";
    }

    if (!email || typeof email !== "string") {
      throw "O valor 'email' não é válido.";
    }

    if (!password || typeof password !== "string") {
      throw "O valor 'password' não é válido.";
    }

    const encryptedPassword = encrypt(password);

    const response = await api().post("create-profile-account", {
      accountancyUid,
      profileUid,
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    });

    return response.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`CREATE PROFILE ACCOUNT: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
