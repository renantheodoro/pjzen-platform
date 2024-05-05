import api from "@/services/config/api";
import webErrorHandler from "@/helpers/webErrorHandler";
import {
  validateStringField,
  validateNumberField,
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
      id,
      companyUid,
      serviceName,
      internalCode,
      type,
      cnaeCode,
      cnaeDescription,
      sellingValue,
      // coastValue,
      municipalServiceCode,
      complementaryLawCode,
      operationNature,
      serviceUF,
      serviceCity,
      serviceCityCode,
      iss,
      // inss,
    } = data;

    let errorMessage = "";

    if (!validateStringField("id", id)) {
      errorMessage +=
        "O campo 'id' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("serviceName", serviceName)) {
      errorMessage +=
        "O campo 'serviceName' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("internalCode", internalCode)) {
      errorMessage +=
        "O campo 'internalCode' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("type", type)) {
      errorMessage +=
        "O campo 'type' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("cnaeCode", cnaeCode)) {
      errorMessage +=
        "O campo 'cnaeCode' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("cnaeDescription", cnaeDescription)) {
      errorMessage +=
        "O campo 'cnaeDescription' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateNumberField("sellingValue", sellingValue)) {
      errorMessage +=
        "O campo 'sellingValue' é obrigatório e deve ser um número válido. ";
    }

    // if (!validateNumberField("coastValue", coastValue)) {
    //   errorMessage +=
    //     "O campo 'coastValue' é obrigatório e deve ser um número válido. ";
    // }

    if (!validateStringField("municipalServiceCode", municipalServiceCode)) {
      errorMessage +=
        "O campo 'municipalServiceCode' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateNumberField("complementaryLawCode", complementaryLawCode)) {
      errorMessage +=
        "O campo 'complementaryLawCode' é obrigatório e deve ser um número válido. ";
    }

    if (!validateStringField("operationNature", operationNature)) {
      errorMessage +=
        "O campo 'operationNature' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("serviceUF", serviceUF)) {
      errorMessage +=
        "O campo 'serviceUF' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("serviceCity", serviceCity)) {
      errorMessage +=
        "O campo 'serviceCity' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateNumberField("serviceCityCode", serviceCityCode)) {
      errorMessage +=
        "O campo 'serviceCityCode' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateBooleanField("iss.hasRetainedIss", iss.hasRetainedIss)) {
      errorMessage +=
        "O campo 'hasRetainedIss' é obrigatório e deve ser um bool válido. ";
    }

    if (!validateNumberField("iss.value", iss.value)) {
      errorMessage +=
        "O campo 'iss' é obrigatório e deve ser uma string válida. ";
    }

    if (!validateStringField("iss.responsible", iss.responsible)) {
      errorMessage +=
        "O campo 'issResponsible' é obrigatório e deve ser uma string válida. ";
    }

    if (errorMessage) {
      throw errorMessage.trim();
    }

    const serviceData = {
      id,
      companyUid,
      serviceName,
      internalCode,
      type,
      sellingValue,
      cnae: {
        code: cnaeCode,
        description: cnaeDescription,
      },
      // coastValue,
      municipalServiceCode,
      complementaryLawCode,
      operationNature,
      serviceUF,
      serviceCity,
      serviceCityCode,
      iss,
    };

    const response = await api().post(
      `update-client-service/${id}`,
      serviceData
    );

    return response;
  } catch (error) {
    const errorMessage = webErrorHandler(error);
    throw errorMessage;
  }
};
