import api from "@/services/config/api";
import { setAccountancyDataToLocalStorage } from "@/helpers/local-storage";
import { errorLog } from "@/helpers/log";
import { encrypt } from "@/helpers/encrypt";

export default async (data) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      company,
      cnpj,
      clientsNumber,
      serviceType,
    } = data;

    if (!firstName || typeof firstName !== "string") {
      errorLog("O campo 'firstName' é obrigatório e deve ser uma string.");
      return;
    }

    if (!lastName || typeof lastName !== "string") {
      errorLog("O campo 'lastName' é obrigatório e deve ser uma string.");
      return;
    }

    if (!email || typeof email !== "string") {
      errorLog("O campo 'email' é obrigatório e deve ser uma string.");
      return;
    }

    if (!password || typeof password !== "string") {
      errorLog("O campo 'password' é obrigatório e deve ser uma string.");
      return;
    }

    if (!phone || typeof phone !== "string") {
      errorLog("O campo 'phone' é obrigatório e deve ser uma string.");
      return;
    }

    if (!company || typeof company !== "string") {
      errorLog("O campo 'company' é obrigatório e deve ser uma string.");
      return;
    }

    if (!cnpj || typeof cnpj !== "string") {
      errorLog("O campo 'cnpj' é obrigatório e deve ser uma string.");
      return;
    }

    if (!clientsNumber || typeof clientsNumber !== "string") {
      errorLog("O campo 'clientsNumber' é obrigatório e deve ser uma string.");
      return;
    }

    if (!serviceType || typeof serviceType !== "string") {
      errorLog("O campo 'serviceType' é obrigatório e deve ser uma string.");
      return;
    }

    const encryptedPassword = encrypt(password);
    const encryptedCnpj = encrypt(cnpj);

    data.password = encryptedPassword;
    data.cnpj = encryptedCnpj;

    const accountancyData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: encryptedPassword,
      phone: data.phone,
      company: data.company,
      cpfCnpj: encryptedCnpj,
      clientsNumber: data.clientsNumber,
      serviceType: data.serviceType,
    };

    const response = await api().post("create-accountancy", accountancyData);

    if (response?.data?.data?.accountancyData) {
      setAccountancyDataToLocalStorage(response.data.data.accountancyData);
    } else {
      throw "Ocorreu um erro ao salvar localmente os dados da contabilidade";
    }

    return response;
  } catch (error) {
    console.error("error", error);

    let errorMessage = error?.response?.data?.message;

    if (!errorMessage) {
      errorMessage = "Ocorreu um erro desconhecido.";
    }

    errorLog(`CREATE ACCOUNTANCY: ${errorMessage} - ${error}`);
    throw errorMessage;
  }
};
