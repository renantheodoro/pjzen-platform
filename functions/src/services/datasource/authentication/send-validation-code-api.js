/**
 * Serviço Firebase-Send-Validation-Code
 *
 * Este serviço é responsável por enviar um código de validação por e-mail para um usuário específico,
 * com o objetivo de realizar a verificação de sua identidade. O código é armazenado no banco de dados associado ao usuário.
 *
 * Parâmetros de Entrada:
 * - authorization (Header): Chave de autenticação para acessar o serviço.
 * - documentId: Identificador único associado ao usuário no banco de dados.
 * - email: Endereço de e-mail ao qual o código de validação será enviado.
 *
 * Funcionamento do Serviço:
 * - Autenticação: O serviço requer uma chave de autorização (apiKey) para garantir acesso seguro.
 * - Geração do Código: Um código de validação é gerado aleatoriamente.
 * - Armazenamento do Código: O código de validação é armazenado no banco de dados associado ao usuário.
 * - Envio de E-mail: Utilizando o serviço de transporte de e-mail (nodemailer), o serviço envia um e-mail contendo o código de validação.
 * - Logs: Todas as ações do serviço são registradas por meio do módulo 'logApi'.
 * - Erros: Em caso de falha, o serviço utiliza o módulo 'errorHandler' para gerar uma resposta adequada.
 *
 * Notas:
 * - As informações de autenticação do e-mail (usuário e senha) devem ser configuradas adequadamente.
 *
 * Exemplo de Uso:
 * ```
 * POST /firebase-send-validation-code
 * Headers: { authorization: 'API_KEY' }
 * Body: {
 *   documentId: 'uniqueUserId',
 *   email: 'john.doe@example.com',
 * }
 * ```
 */

const admin = require("../../../firebase/firebase-admin");
const errorHandler = require("../../../data/error-handler");
const nodemailer = require("nodemailer");
const { ACCOUNTANCIES_COLLECTION } = require("../../../data/collections");
const { logApi } = require("../../../data/log-api");
const validateRequest = require("../../common/validate-request");

const apiServiceTitle = "FIREBASE SEND VALIDATION CODE";

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const { documentId, email } = req.body;

    logApi(apiServiceTitle, "Iniciando envio de código de validação...");

    const validationCode = Math.floor(10000 + Math.random() * 90000);

    try {
      const userDocRef = admin
        .firestore()
        .collection(ACCOUNTANCIES_COLLECTION)
        .doc(documentId);

      await userDocRef.update({
        "authenticationData.validationCode": validationCode,
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODE_MAILER_EMAIL,
          pass: process.env.NODE_MAILER_PASS,
        },
      });

      const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: "Código de Verificação",
        text: `
        <div style="background-color: #fff;  padding: 14px 20px; border-radius: 8px; padding: 28px; border: 1px solid #eeeeee;">
          <h2 style="font-size: 18px; margin-bottom: 20px; color: #353535;">Código de Verificação</h2>
          <p style="font-size: 16px; color: #353535;">Seu código de verificação é: <strong>${validationCode}</strong></p>
        </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logApi(
            apiServiceTitle,
            "Erro ao enviar código de validação por e-mail:",
            error
          );
        } else {
          logApi(
            apiServiceTitle,
            `Código de validação enviado para o e-mail com sucesso: ${info.response}`
          );
        }
      });

      const successMessage = "Código enviado com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
