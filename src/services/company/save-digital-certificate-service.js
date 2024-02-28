import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import {
  validateStringField,
  validateFileField,
} from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";
import { encrypt } from "@/helpers/encrypt";

export default async (data) => {
  try {
    await validateToken();

    const accountancyUid = getAccountancyDataFromLocalStorage().uid;

    if (!accountancyUid) {
      throw Error("UID da contabilidade não foi encontrado.");
    }

    const { clientUid, type, file: blobUrl, password } = data;

    const blobFile = await fetch(blobUrl).then((response) => response.blob());

    if (
      !validateStringField("clientUid", clientUid) ||
      !validateStringField("type", type) ||
      !validateFileField("file", blobFile) ||
      !validateStringField("password", password)
    ) {
      throw Error("Erro de validação dos campos. Verifique e tente novamente.");
    }

    // Converter Blob para Base64
    const base64Promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blobFile);
    });

    const base64Data = await base64Promise;

    const encryptedPassword = encrypt(password);

    const digitalCertificateData = {
      clientUid,
      type,
      file: base64Data,
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
