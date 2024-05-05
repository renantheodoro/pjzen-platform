import api from "@/services/config/api";
import webErrorHandler from "@/helpers/webErrorHandler";
import { validateStringField } from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";
import { encrypt } from "@/helpers/encrypt";

export default async (data) => {
  try {
    await validateToken();

    const {
      companyUid,
      cpfCnpj,
      businessName,
      municipalRegistration = null,
      address,
      phone,
      email,
    } = data;

    let errorMessage = "";

    if (!validateStringField("companyUid", companyUid)) {
      errorMessage +=
        "O campo 'companyUid' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("cpfCnpj", cpfCnpj)) {
      errorMessage +=
        "O campo 'CPF/CNPJ' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("businessName", businessName)) {
      errorMessage +=
        "O campo 'businessName' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("phone", phone)) {
      errorMessage +=
        "O campo 'phone' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("email", email)) {
      errorMessage +=
        "O campo 'email' é obrigatório e deve ser uma string válida. ";
    }

    if (
      municipalRegistration !== null &&
      !validateStringField("municipalRegistration", municipalRegistration)
    ) {
      errorMessage +=
        "O campo 'municipalRegistration' deve ser uma string válida. ";
    }

    if (errorMessage) {
      throw Error(errorMessage.trim());
    }

    const encryptedCpfCnpj = encrypt(cpfCnpj);

    const takerData = {
      companyUid,
      cpfCnpj: encryptedCpfCnpj,
      businessName,
      municipalRegistration,
      address,
      phone,
      email,
    };

    const response = await api().post(`update-client-taker`, takerData);

    return response;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
