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
  try {
    await validateToken();

    const accountancyUid = getAccountancyDataFromLocalStorage()?.uid;

    if (!accountancyUid) {
      throw "UID da contabilidade não foi encontrado.";
    }

    const {
      entityType,
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
      prefectureLogin,
      prefecturePassword,
    } = data;

    let errorMessage = "";

    if (!validateStringField("entityType", entityType)) {
      errorMessage += "Tipo de entidade inválido. ";
    }

    if (!validateBooleanField("isActive", isActive)) {
      errorMessage += "Status de atividade inválido. ";
    }

    if (!validateStringField("cpfCnpj", cpfCnpj)) {
      errorMessage += "CPF/CNPJ inválido. ";
    }

    if (!validateStringField("businessName", businessName)) {
      errorMessage += "Nome comercial inválido. ";
    }

    if (!validateStringField("tradeName", tradeName)) {
      errorMessage += "Nome fantasia inválido. ";
    }

    if (!validateStringField("cnae", cnae)) {
      errorMessage += "CNAE inválido. ";
    }

    if (!validateStringField("foundationDate", foundationDate)) {
      errorMessage += "Data de fundação inválida. ";
    }

    if (!validateStringField("taxRegime", taxRegime)) {
      errorMessage += "Regime tributário inválido. ";
    }

    if (!validateStringField("companyOffering", companyOffering)) {
      errorMessage += "Oferta da empresa inválida. ";
    }

    if (!validateStringField("municipalRegistration", municipalRegistration)) {
      errorMessage += "Registro municipal inválido. ";
    }

    if (
      !address ||
      !validateCepField("zipcode", address.zipcode) ||
      !validateStringField("street", address.street) ||
      !validateStringField("number", address.number) ||
      !validateStringField("city", address.city) ||
      !validateStringField("uf", address.uf) ||
      !validateStringField("neighborhood", address.neighborhood)
    ) {
      errorMessage += "Erro nos dados de endereço. ";
    }

    if (!validateEmailField("email", email)) {
      errorMessage += "E-mail inválido. ";
    }

    if (!validatePhoneField("phone", phone)) {
      errorMessage += "Número de telefone inválido. ";
    }

    if (errorMessage) {
      throw errorMessage.trim();
    }

    const encryptedCpfCnpj = encrypt(cpfCnpj);
    const encryptedMunicipalRegistration = encrypt(municipalRegistration);

    const companyData = {
      accountancyUid,
      entityType,
      isActive,
      cpfCnpj: encryptedCpfCnpj,
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
        uf: address.uf,
        city: address.city,
        neighborhood: address.neighborhood,
      },
      email,
      phone,
      prefectureLogin,
      prefecturePassword,
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
