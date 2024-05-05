import { errorLog } from "@/helpers/log";

export default function webErrorHandler(error) {
  let errorMessage = null;
  let status = "500";

  if (error?.response?.data?.message) {
    errorMessage = error?.response?.data?.message;
    status = error?.response?.data?.status;
  } else if (error.response) {
    status = error.response.status;
    switch (status) {
      case 400:
        errorMessage = "Requisição inválida.";
        break;
      case 401:
        errorMessage = "Não autorizado. Faça login para acessar esta página.";
        break;
      case 404:
        errorMessage = "Recurso não encontrado.";
        break;
      case 500:
        errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
        break;
      // Adicione mais casos conforme necessário
      default:
        errorMessage =
          "Ocorreu um erro inesperado. Tente novamente mais tarde.";
        break;
    }
  } else if (error.request) {
    // Se a solicitação foi feita, mas não houve resposta do servidor
    errorMessage = "Sem resposta do servidor. Tente novamente mais tarde.";
  } else if (errorMessage === null && typeof error === "string") {
    errorMessage = `Ocorreu um erro: ${error}`;
    errorLog(`${errorMessage}`);
    return errorMessage;
  } else {
    // Outros erros que não se enquadram nas categorias anteriores
    errorMessage = "Ocorreu um erro inesperado. Tente novamente mais tarde.";
  }

  errorLog(`${errorMessage} - ${error}`);

  return errorMessage;
}
