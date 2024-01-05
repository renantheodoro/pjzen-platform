/**
 * loginData: {
 *   accessToken: [String] // Token de acesso do usuário,
 *   emailVerified: [Boolean] // Indica se o e-mail do usuário foi verificado,
 *   uid: [String] // Identificador único do usuário,
 *   email: [String] // Endereço de e-mail do usuário,
 * },
 *
 * accountancyInfo: {
 *   firstName: [String] // Primeiro nome do escritório contábil,
 *   lastName: [String] // Sobrenome do responsável pelo escritório contábil,
 *   clientsNumber: [Number] // Número de clientes do escritório contábil,
 *   cnpj: [String] // CNPJ do escritório contábil,
 *   company: [String] // Nome da empresa do escritório contábil,
 *   createdAt: [String] // Data de criação do escritório contábil,
 *   email: [String] // Endereço de e-mail do escritório contábil,
 *   lastModifiedAt: [String] // Data da última modificação do escritório contábil,
 *   phone: [String] // Número de telefone do escritório contábil,
 *   serviceType: [String] // Tipo de serviço oferecido pelo escritório contábil,
 * },
 */

const LOGIN_DATA_LOCALSTORAGE_KEY = "loginData";
const ACCOUNTANCY_INFO_LOCALSTORAGE_KEY = "accountancyInfo";

export const addLoginDataToLocalStorage = (loginData) => {
  localStorage.setItem(LOGIN_DATA_LOCALSTORAGE_KEY, JSON.stringify(loginData));
};

export const getLoginDataFromLocalStorage = () => {
  const storedLoginData = localStorage.getItem(LOGIN_DATA_LOCALSTORAGE_KEY);
  return storedLoginData ? JSON.parse(storedLoginData) : null;
};

export const addAccountancyInfoToLocalStorage = (accountancyInfo) => {
  localStorage.setItem(
    ACCOUNTANCY_INFO_LOCALSTORAGE_KEY,
    JSON.stringify(accountancyInfo)
  );
};

export const getAccountancyInfoFromLocalStorage = () => {
  const storedAccountancyInfo = localStorage.getItem(
    ACCOUNTANCY_INFO_LOCALSTORAGE_KEY
  );
  return storedAccountancyInfo ? JSON.parse(storedAccountancyInfo) : null;
};
