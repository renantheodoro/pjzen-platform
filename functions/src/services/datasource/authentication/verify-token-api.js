/**
 * Serviço Verify-Token
 *
 * Este serviço é responsável por verificar a validade de um token de autenticação.
 *
 * Parâmetros de Entrada:
 * - token: Token de autenticação a ser verificado.
 *
 * Funcionamento do Serviço:
 * - Decodificação do Token: Utiliza o serviço do Firebase Authentication para decodificar o token.
 * - Resposta de Sucesso: Se o token for válido, retorna uma resposta de sucesso junto com os dados decodificados.
 * - Logs: Todas as ações do serviço são registradas por meio do módulo 'logApi'.
 * - Erros: Em caso de falha, o serviço utiliza o módulo 'errorHandler' para gerar uma resposta adequada.
 *
 * Exemplo de Uso:
 * ```
 * POST /verify-token
 * Body: {
 *   token: 'authenticationToken123',
 * }
 * ```
 */

const admin = require("../../../firebase/firebase-admin");
const { logApi } = require("../../../data/log-api");
const errorHandler = require("../../../data/error-handler");

const apiServiceTitle = "VERIFY TOKEN";

module.exports = {
  async call(req, res) {
    const { token } = req.body;

    logApi(apiServiceTitle, "Iniciando verificação do token...");

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      const successMessage = "O token atual é válido.";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: {
          token: decodedToken,
        },
      });

      return decodedToken;
    } catch (error) {
      const { status, message } = errorHandler(error, apiServiceTitle);
      res.status(status).send(message);
    }
  },
};
