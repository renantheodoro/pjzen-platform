import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { validateToken } from "@/services/common/interceptor-service";

export default async (data) => {
  try {
    await validateToken();

    if (!data) {
      throw "UID do cliente não foi recebido .";
    }

    const { companyUid } = data;

    const response = await api().get(
      `get-digital-certificate-list?companyUid=${companyUid}`
    );

    return response?.data?.data?.digitalCertificatesData;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`GET DIGITAL CERTIFICATES LIST: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
