import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import {
  validateStringField,
  validateBase64Field,
} from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";
import { encrypt } from "@/helpers/encrypt";

export default async (data) => {
  try {
    await validateToken();

    const accountancyUid = getAccountancyDataFromLocalStorage()?.uid;

    if (!accountancyUid) {
      throw "UID da contabilidade não foi encontrado.";
    }

    const { companyUid, type, file, password } = data;

    // Converter File para Base64
    const base64Promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const base64Data = await base64Promise;

    let errorMessage = "";

    if (!validateStringField("companyUid", companyUid)) {
      errorMessage +=
        "O campo 'companyUid' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("type", type)) {
      errorMessage +=
        "O campo 'type' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateBase64Field("base64Data", base64Data)) {
      errorMessage +=
        "O campo 'file' é obrigatório e deve ser um arquivo válido. ";
    }

    if (!validateStringField("password", password)) {
      errorMessage +=
        "O campo 'password' é obrigatório e deve ser uma string válida. ";
    }

    if (errorMessage) {
      throw errorMessage.trim();
    }

    const encryptedPassword = encrypt(password);

    const digitalCertificateData = {
      companyUid,
      type,
      fileBase64: base64Data,
      password: encryptedPassword,
    };

    const response = await api().post(
      "save-digital-certificate",
      digitalCertificateData
    );

    return response;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`DIGITAL CERTIFICATE SERVICE: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
