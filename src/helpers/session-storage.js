/**
 * accessToken: [String] // Token de acesso do usuário
 */

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";

/** GET */
export const getTokenFromSessionStorage = () => {
  const storedToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);

  if (
    storedToken !== "undefined" &&
    storedToken !== undefined &&
    storedToken !== "" &&
    storedToken !== null
  ) {
    return JSON.parse(storedToken);
  }

  return null;
};

/** SET */
export const setTokenToSessionStorage = (data) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(data));
};
