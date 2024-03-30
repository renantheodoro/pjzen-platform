const { plugNotasErrorApi } = require("../data/log-api");

module.exports = (error, apiServiceTitle) => {
  // console.log("-- error", error);

  let errorStatus = 500;
  let errorMessage = `Ocorreu um erro desconhecido ao integrar com serviço de Emissão de Notas: ${error}`;
  let errorData;

  if (error?.response) {
    errorStatus = error?.response?.status;
    errorMessage =
      error?.response?.data?.error?.message ?? error?.response?.data?.message;
    errorData =
      error?.response?.data?.error?.data ?? error?.response?.data?.error;
  }

  plugNotasErrorApi(apiServiceTitle, errorMessage, errorData);

  return {
    status: errorStatus,
    message: errorMessage,
    details: errorData,
  };
};
