const { errorApi } = require("../data/log-api");

module.exports = (error, apiServiceTitle) => {
  let errorDescription;

  if (error?.errorInfo?.code) {
    errorDescription = error?.errorInfo?.code;
  } else if (error?.code) {
    errorDescription = error?.code;
  } else {
    errorDescription = error;
  }

  const errorDetails = error?.errorInfo?.message
    ? error?.errorInfo?.message
    : error;

  let errorText;
  let errorStatus;

  switch (errorDescription) {
    case "auth/invalid-credential":
    case "auth/invalid-email":
    case "invalid-argument":
      errorText = "Credenciais ou argumentos inválidos. Verifique seus dados";
      errorStatus = 400; // Bad Request
      break;
    case "auth/weak-password":
      errorText = "A senha fornecida é fraca. Deve ter pelo menos 6 caracteres";
      errorStatus = 400; // Bad Request
      break;
    case "file-not-blob":
      errorText = "O arquivo recebido não tem o formato válido";
      errorStatus = 400; // Bad Request
      break;
    case "auth/unauthenticated":
      errorText =
        "Usuário não autenticado. Faça login antes de realizar esta operação";
      errorStatus = 401; // Unauthorized
      break;
    case "invalid-code-verification":
      errorText = "Código fornecido não confere";
      errorStatus = 401; // Unauthorized
      break;
    case "auth/wrong-password":
      errorText = "Senha incorreta. Tente novamente";
      errorStatus = 401; // Unauthorized
      break;
    case "auth/id-token-expired":
      errorText = "Token de autenticação expirado. Faça login novamente.";
      errorStatus = 401; // Unauthorized
      break;
    case "unauthorized":
    case "auth/invalid-api-key":
      errorText = "Requisição não autorizada";
      errorStatus = 401; // Unauthorized
      break;
    case "storage/unauthorized":
      errorText =
        "Permissão negada. Não foi possível gravar dados no armazenamento. Por favor, verifique suas credenciais e certifique-se de ter as permissões adequadas para acessar o armazenamento.";
      errorStatus = 403; // Forbidden
      break;
    case "auth/permission-denied":
      errorText =
        "Permissão negada. Verifique as regras de segurança do Firestore";
      errorStatus = 403; // Forbidden
      break;
    case "auth/user-not-found":
    case "error/not-found":
      errorText =
        "Usuário ou documento não encontrado. Verifique as credenciais";
      errorStatus = 404; // Not Found
      break;
    case "auth/email-already-exists":
    case "auth/email-already-in-use":
      errorText = "Usuário já existe. Não é possível criar uma nova conta";
      errorStatus = 409; // Conflict
      break;
    case "auth/too-many-requests":
      errorText = "Muitas tentativas de login. Tente novamente mais tarde";
      errorStatus = 429; // Too Many Requests
      break;
    default:
      errorText =
        "Erro desconhecido ao realizar operação. Entre em contato ou tente novamente mais tarde";
      errorStatus = 500; // Internal Server Error
      break;
  }

  errorApi(apiServiceTitle, errorText, errorDetails);

  return {
    status: errorStatus,
    message: errorText,
    details: errorDetails,
  };
};
