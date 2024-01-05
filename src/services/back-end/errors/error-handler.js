export default function (error) {
  let errorMessage;

  switch (error.code) {
    case "auth/permission-denied":
      errorMessage =
        "Permissão negada. Verifique as regras de segurança do Firestore.";
      break;
    case "unauthenticated":
      errorMessage =
        "Usuário não autenticado. Faça login antes de realizar esta operação.";
      break;
    case "auth/user-not-found":
      errorMessage = "Usuário não encontrado. Verifique as credenciais.";
      break;
    case "auth/wrong-password":
      errorMessage = "Senha incorreta. Tente novamente.";
      break;
    case "auth/weak-password":
      errorMessage =
        "A senha fornecida é fraca. Deve ter pelo menos 6 caracteres.";
      break;
    case "auth/invalid-email":
      errorMessage = "O e-mail fornecido não é válido.";
      break;
    case "auth/invalid-credential":
      errorMessage = "As credenciais fornecidas são inválidas.";
      break;
    case "invalid-argument":
      errorMessage =
        "Um argumento inválido foi fornecido. Por favor, verifique seus dados.";
      break;
    case "auth/too-many-requests":
      errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
      break;
    case "auth/email-already-in-use":
      errorMessage = "Usuário já existe. Não é possível criar uma nova conta.";
      break;
    case "error/not-found":
      errorMessage = "Documento não encontrado no banco de dados.";
      break;
    default:
      errorMessage = "Erro desconhecido ao realizar operação: " + error.code;
      break;
  }

  return errorMessage;
}
