/**
 * userData: {
 *   emailVerified: [Boolean] // Indica se o e-mail do usuário foi verificado,
 *   uid: [String] // Identificador único do usuário,
 *   email: [String] // Endereço de e-mail do usuário,
 * },
 *
 * accountancyInfo: {
 *   uid: [String] // Identificador único do usuário,
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
 * 
 */

const USER_DATA_LOCALSTORAGE_KEY = "USER_DATA";
const ACCOUNTANCY_DATA_LOCALSTORAGE_KEY = "ACCOUNTANCY_INFO";

/** GET */
export const getUserDataFromLocalStorage = () => {
  const storedUserData = localStorage.getItem(USER_DATA_LOCALSTORAGE_KEY);

  if (
    storedUserData !== "undefined" &&
    storedUserData !== undefined &&
    storedUserData !== "" &&
    storedUserData !== null
  ) {
    return JSON.parse(storedUserData);
  }

  return null;
};

export const getAccountancyDataFromLocalStorage = () => {
  const storedAccountancyData = localStorage.getItem(
    ACCOUNTANCY_DATA_LOCALSTORAGE_KEY
  );

  if (
    storedAccountancyData !== "undefined" &&
    storedAccountancyData !== undefined &&
    storedAccountancyData !== "" &&
    storedAccountancyData !== null
  ) {
    return JSON.parse(storedAccountancyData);
  }

  return null;
};

/** SET */
export const setUserDataToLocalStorage = (data) => {
  localStorage.setItem(USER_DATA_LOCALSTORAGE_KEY, JSON.stringify(data));
};

export const setAccountancyDataToLocalStorage = (data) => {
  localStorage.setItem(ACCOUNTANCY_DATA_LOCALSTORAGE_KEY, JSON.stringify(data));
};
