import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
import { encrypt } from "@/helpers/encrypt";
import {
  validateStringField,
  validateNumberField,
  validateEmailField,
  validatePhoneField,
  validateCepField,
} from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";

export default async (data) => {
  try {
    await validateToken();

    const accountancyUid = getAccountancyDataFromLocalStorage().uid;

    if (!accountancyUid) {
      throw Error("UID da contabilidade não foi encontrado.");
    }

    const {
      entityType,
      cnpj,
      businessName,
      tradeName,
      cnae,
      foundationDate,
      taxRegime,
      companyOffering,
      municipalRegistration,
      address,
      email,
      comercialPhone,
    } = data;

    if (
      !validateStringField("entityType", entityType) ||
      !validateStringField("cnpj", cnpj) ||
      !validateStringField("businessName", businessName) ||
      !validateStringField("tradeName", tradeName) ||
      !validateStringField("cnae", cnae) ||
      !validateStringField("foundationDate", foundationDate) ||
      !validateStringField("taxRegime", taxRegime) ||
      !validateStringField("companyOffering", companyOffering) ||
      !validateStringField("municipalRegistration", municipalRegistration) ||
      !address ||
      !validateCepField("zipcode", address.zipcode) ||
      !validateStringField("street", address.street) ||
      !validateNumberField("number", address.number) ||
      !validateStringField("city", address.city) ||
      !validateStringField("neighborhood", address.neighborhood) ||
      !validateEmailField("email", email) ||
      !validatePhoneField("comercialPhone", comercialPhone)
    ) {
      throw Error("Erro de validação dos campos. Verifique e tente novamente.");
    }

    const encryptedCNPJ = encrypt(cnpj);
    const encryptedMunicipalRegistration = encrypt(municipalRegistration);

    const companyData = {
      accountancyUid,
      entityType,
      cnpj: encryptedCNPJ,
      businessName,
      tradeName,
      cnae,
      foundationDate,
      taxRegime,
      companyOffering,
      municipalRegistration: encryptedMunicipalRegistration,
      address: {
        zipcode: address.zipcode,
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        neighborhood: address.neighborhood,
      },
      email,
      comercialPhone,
    };

    const response = await api().post("create-client-company", companyData);

    return response;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`CREATE CLIENT COMPANY: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
