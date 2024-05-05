/**
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

const ACCOUNTANCY_DATA_LOCALSTORAGE_KEY = "ACCOUNTANCY_INFO";
const PROFILE_DATA_LOCALSTORAGE_KEY = "PROFILE_INFO";
const USER_SESSION_KEY = "USER_SESSION";

/** GET */
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

export const getProfileDataFromLocalStorage = () => {
  const storedProfileData = localStorage.getItem(PROFILE_DATA_LOCALSTORAGE_KEY);

  if (
    storedProfileData !== "undefined" &&
    storedProfileData !== undefined &&
    storedProfileData !== "" &&
    storedProfileData !== null
  ) {
    return JSON.parse(storedProfileData);
  }

  return null;
};

export const getUserSessionStorage = () => {
  const storedUserSession = localStorage.getItem(USER_SESSION_KEY);

  if (
    storedUserSession !== "undefined" &&
    storedUserSession !== undefined &&
    storedUserSession !== "" &&
    storedUserSession !== null
  ) {
    return JSON.parse(storedUserSession);
  }

  return null;
};

/** SET */
export const setAccountancyDataToLocalStorage = (data) => {
  localStorage.setItem(ACCOUNTANCY_DATA_LOCALSTORAGE_KEY, JSON.stringify(data));
};

export const setProfileDataToLocalStorage = (data) => {
  localStorage.setItem(PROFILE_DATA_LOCALSTORAGE_KEY, JSON.stringify(data));
};

export const setUserSessionStorage = (data) => {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data));
};
