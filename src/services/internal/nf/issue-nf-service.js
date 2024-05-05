import api from "@/services/config/api";
import { errorLog } from "@/helpers/log";
// import { encrypt } from "@/helpers/encrypt";
import {
  validateNumberField,
  validateStringField,
} from "@/helpers/validate-fields";
import { validateToken } from "@/services/common/interceptor-service";

export default async (data) => {
  try {
    await validateToken();

    const {
      companyUid,
      sellingValue,
      sellingDate,
      taker,
      service,
      // itemDetails,
      quantity,
      unityValue,
      total,
      totalWithDiscounts,
      operationNature,
      observations,
      rps,
      rpsSerie,
      rpsDate,
      rpsDueDate,
      iss,
      importMethod,
    } = data;

    let errorMessage = "";

    if (!validateStringField("companyUid", companyUid)) {
      errorMessage += "O campo 'companyUid' é inválido.\n";
    }

    if (!validateStringField("sellingValue", sellingValue)) {
      errorMessage += "O campo 'sellingValue' é inválido.\n";
    }

    if (!validateStringField("sellingDate", sellingValue)) {
      errorMessage += "O campo 'sellingDate' é inválido.\n";
    }

    if (!validateStringField("takerId", taker.id)) {
      errorMessage += "O campo 'takerId' é obrigatório.\n";
    }

    if (!validateStringField("serviceId", service.id)) {
      errorMessage += "O campo 'service' é obrigatório.\n";
    }

    // if (!validateStringField("itemDetails", itemDetails)) {
    //   errorMessage += "O campo 'itemDetails' é inválido.\n";
    // }

    if (!validateNumberField("quantity", quantity)) {
      errorMessage += "O campo 'quantity' é inválido.\n";
    }

    if (!validateStringField("unityValue", unityValue)) {
      errorMessage += "O campo 'unityValue' é inválido.\n";
    }

    if (!validateStringField("total", total)) {
      errorMessage += "O campo 'total' é inválido.\n";
    }

    if (!validateStringField("totalWithDiscounts", totalWithDiscounts)) {
      errorMessage += "O campo 'totalWithDiscounts' é inválido.\n";
    }

    if (!validateStringField("operationNature", operationNature)) {
      errorMessage += "O campo 'operationNature' é inválido.\n";
    }

    if (!validateStringField("observations", observations)) {
      errorMessage += "O campo 'observations' é inválido.\n";
    }

    if (!validateStringField("rps", rps)) {
      errorMessage += "O campo 'rps' é inválido.\n";
    }

    if (!validateStringField("rpsSerie", rpsSerie)) {
      errorMessage += "O campo 'rpsSerie' é inválido.\n";
    }

    if (!validateStringField("rpsDate", rpsDate)) {
      errorMessage += "O campo 'rpsDate' é inválido.\n";
    }

    if (!validateStringField("rpsDueDate", rpsDueDate)) {
      errorMessage += "O campo 'rpsDueDate' é inválido.\n";
    }

    if (!validateStringField("importMethod", importMethod)) {
      errorMessage += "O campo 'importMethod' é inválido.\n";
    }

    if (!iss) {
      errorMessage += "O campo 'iss' é obrigatório.\n";
    }

    if (errorMessage) {
      throw errorMessage.trim();
    }

    const nfData = {
      companyUid,
      takerReference: `client-takers/${taker.id}`,
      serviceReference: `client-services/${service.id}`,
      sellingValue,
      sellingDate,
      // itemDetails,
      quantity,
      unityValue,
      total,
      totalWithDiscounts,
      operationNature,
      observations,
      rps,
      rpsSerie,
      rpsDate,
      rpsDueDate,
      iss,
      importMethod,
    };

    const response = await api().post("issue-nf", nfData);

    return response.data;
  } catch (error) {
    let errorMessage = error?.response?.data?.message ?? error;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    if (errorMessage == "Falha na validação do JSON de NFSe") {
      errorMessage = error?.response?.data?.details?.fields ?? error;
    }

    errorLog(`ISSUE NF: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
