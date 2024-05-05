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
      errorMessage += "UID da empresa inválido. ";
    }

    if (!validateStringField("cnpj", cpfCnpj)) {
      errorMessage += "CNPJ inválido. ";
    }

    if (!validateStringField("businessName", businessName)) {
      errorMessage += "Nome comercial inválido. ";
    }

    if (!validateStringField("phone", phone)) {
      errorMessage += "Número de telefone inválido. ";
    }

    if (!validateStringField("email", email)) {
      errorMessage += "E-mail inválido. ";
    }

    if (
      municipalRegistration != null &&
      !validateStringField("municipalRegistration", municipalRegistration)
    ) {
      errorMessage += "Registro municipal inválido. ";
    }

    if (errorMessage) {
      throw errorMessage.trim();
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

    const response = await api().post("create-client-taker", takerData);

    return response;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
