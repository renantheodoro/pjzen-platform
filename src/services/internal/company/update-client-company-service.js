import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { encrypt } from "@/helpers/encrypt";
import {
  validateStringField,
  validateEmailField,
  validatePhoneField,
  validateCepField,
  validateBooleanField,
} from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";

export default async (data) => {
  const accountancyUid = getAccountancyDataFromLocalStorage()?.uid;

  if (!accountancyUid) {
    throw "UID da contabilidade não foi encontrado.";
  }

  try {
    await validateToken();

    const {
      companyUid,
      isActive,
      cpfCnpj,
      businessName,
      tradeName,
      cnae,
      foundationDate,
      taxRegime,
      companyOffering,
      municipalRegistration,
      address,
      email,
      phone,
    } = data;

    let errorMessage = "";

    if (!validateBooleanField("isActive", isActive)) {
      errorMessage += "O campo 'isActive' deve ser um booleano válido. ";
    }

    if (!validateStringField("cpfCnpj", cpfCnpj)) {
      errorMessage +=
        "O campo 'CPF/CNPJ' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("businessName", businessName)) {
      errorMessage +=
        "O campo 'businessName' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("tradeName", tradeName)) {
      errorMessage +=
        "O campo 'tradeName' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("cnae", cnae)) {
      errorMessage +=
        "O campo 'cnae' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("foundationDate", foundationDate)) {
      errorMessage +=
        "O campo 'foundationDate' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("taxRegime", taxRegime)) {
      errorMessage +=
        "O campo 'taxRegime' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("companyOffering", companyOffering)) {
      errorMessage +=
        "O campo 'companyOffering' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("municipalRegistration", municipalRegistration)) {
      errorMessage +=
        "O campo 'municipalRegistration' é obrigatório e deve ser uma string válida. ";
    }

    if (
      !address ||
      !validateCepField("zipcode", address.zipcode) ||
      !validateStringField("street", address.street) ||
      !validateStringField("number", address.number) ||
      !validateStringField("city", address.city) ||
      !validateStringField("neighborhood", address.neighborhood) ||
      !validateStringField("uf", address.uf)
    ) {
      errorMessage += "Erro nos dados de endereço. ";
    }

    if (!validateEmailField("email", email)) {
      errorMessage +=
        "O campo 'email' é obrigatório e deve ser um e-mail válido. ";
    }

    if (!validatePhoneField("phone", phone)) {
      errorMessage +=
        "O campo 'phone' é obrigatório e deve ser um número de telefone válido. ";
    }

    if (errorMessage) {
      throw Error(errorMessage.trim());
    }

    const encryptedCpfCnpj = encrypt(cpfCnpj);
    const encryptedMunicipalRegistration = encrypt(municipalRegistration);

    const companyData = {
      isActive,
      cpfCnpj: encryptedCpfCnpj,
      businessName,
      tradeName,
      cnae,
      foundationDate,
      taxRegime,
      companyOffering,
      municipalRegistration: encryptedMunicipalRegistration,
      address,
      email,
      phone,
    };

    const response = await api().post(
      `update-client-company/${companyUid}`,
      companyData
    );

    return response;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`UPDATE CLIENT COMPANY: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
