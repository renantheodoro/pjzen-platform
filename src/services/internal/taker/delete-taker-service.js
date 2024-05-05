import api from "@/services/config/api";
import webErrorHandler from "@/helpers/webErrorHandler";
import { validateStringField } from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";
import getCleanDocument from "@/helpers/get-clean-document";

export default async (cpfCnpj) => {
  try {
    await validateToken();
    if (!validateStringField("cpfCnpj", cpfCnpj)) {
      throw "cpfCnpj do tomador inválido.";
    }

    const response = await api().post(
      `delete-client-taker/${getCleanDocument(cpfCnpj)}`
    );

    return response;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
