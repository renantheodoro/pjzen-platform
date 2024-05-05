/**
 * Serviço Create-Accountancy
 *
 * Este serviço é responsável por realizar o cadastro de contabilidades no sistema. A entidade 'accountancy'
 * se refere a uma empresa de contabilidade e possui os seguintes parâmetros e atributos:
 *
 * Parâmetros de entrada:
 * - authorization (Header): Chave de autenticação para acessar o serviço.
 * - firstName: Nome do responsável pela contabilidade.
 * - lastName: Sobrenome do responsável pela contabilidade.
 * - email: Endereço de e-mail associado à contabilidade.
 * - password: Senha para autenticação do usuário.
 * - phone: Número de telefone da contabilidade.
 * - company: Nome da empresa de contabilidade.
 * - cpfCnpj: Documento da empresa de contabilidade (criptografado).
 * - clientsNumber: Número de clientes atendidos pela contabilidade.
 * - serviceType: Tipo de serviço oferecido pela contabilidade.
 *
 * Atributos da entidade 'accountancy':
 * - uid: Identificador único associado ao usuário criado.
 * - firstName: Nome do responsável pela contabilidade.
 * - lastName: Sobrenome do responsável pela contabilidade.
 * - email: Endereço de e-mail associado à contabilidade.
 * - phone: Número de telefone da contabilidade.
 * - company: Nome da empresa de contabilidade.
 * - cpfCnpj: Documento da empresa de contabilidade (limpo, sem formatação).
 * - clientsNumber: Número de clientes atendidos pela contabilidade.
 * - serviceType: Tipo de serviço oferecido pela contabilidade.
 * - createdAt: Data e hora de criação do registro no banco de dados.
 * - lastModifiedAt: Data e hora da última modificação do registro no banco de dados.
 *
 * Funcionamento do Serviço:
 * - Autenticação do usuário: O serviço utiliza o Firebase Authentication para criar um novo usuário com o e-mail e senha fornecidos.
 * - Cadastro no banco de dados: Após a autenticação bem-sucedida, os dados da contabilidade são armazenados no Firestore.
 * - Resposta: O serviço retorna informações sobre o usuário criado e a contabilidade, em caso de sucesso.
 * - Logs: Todas as ações do serviço são registradas por meio do módulo 'logApi'.
 * - Erros: Em caso de falha, o serviço utiliza o módulo 'errorHandler' para gerar uma resposta adequada.
 *
 * Nota: O documento é criptografado durante a transmissão e armazenamento, sendo limpo antes de ser persistido no banco de dados.
 *
 * Exemplo de Uso:
 * ```
 * POST /create-accountancy
 * Headers: { authorization: 'API_KEY' }
 * Body: {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@example.com',
 *   password: 'securePassword',
 *   phone: '+123456789',
 *   company: 'ABC Contabilidade',
 *   cpfCnpj: 'encryptedCpfCnpjString',
 *   clientsNumber: 50,
 *   serviceType: 'Consultoria Fiscal'
 * }
 * ```
 */

const admin = require("../../../firebase/firebase-admin");
const config = require("../../../firebase/firebase-config");
const { logApi } = require("../../../data/log-api");
const { doc, setDoc, serverTimestamp } = require("firebase/firestore");
const errorHandler = require("../../../data/error-handler");
const { ACCOUNTANCIES_COLLECTION } = require("../../../data/collections");
const { getCleanDocument } = require("../../../helpers/get-clean-document");
const validateRequest = require("../../common/validate-request");
const { decrypt } = require("../../common/encrypt");

const apiServiceTitle = "CREATE ACCOUNTANCY SERVICE";

const createAuthentication = async (email, password) => {
  const user = await admin.auth().createUser({
    email,
    password,
  });
  return user;
};

module.exports = {
  async call(req, res) {
    const { authorization: apiKey } = req.headers;

    if (!validateRequest(apiKey)) {
      throw "unauthorized";
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      company,
      cpfCnpj,
      clientsNumber,
      serviceType,
    } = req.body;

    const decryptedPassword = decrypt(password);
    const decryptedCpfCnpj = decrypt(cpfCnpj);

    try {
      logApi(apiServiceTitle, "Iniciando cadastro de usuário...");

      const authenticationData = await createAuthentication(
        email,
        decryptedPassword
      );

      logApi(
        apiServiceTitle,
        "Cadastro de usuário realizado com sucesso!",
        authenticationData
      );

      logApi(
        apiServiceTitle,
        "Iniciando cadastro de contabilidade no banco de dados..."
      );

      const accountancyData = {
        uid: authenticationData.uid,
        firstName,
        lastName,
        email,
        phone,
        company,
        cpfCnpj: getCleanDocument(decryptedCpfCnpj),
        clientsNumber,
        serviceType,
        createdAt: serverTimestamp(),
        lastModifiedAt: serverTimestamp(),
      };

      await setDoc(
        doc(config.db, ACCOUNTANCIES_COLLECTION, authenticationData.uid),
        accountancyData
      );

      const response = {
        authenticationData,
        accountancyData,
      };

      const successMessage = "Cadastro realizado com sucesso!";
      logApi(apiServiceTitle, successMessage);

      res.status(200).send({
        status: 200,
        message: successMessage,
        data: response,
      });
    } catch (error) {
      const errorResponse = errorHandler(error, apiServiceTitle);
      res.status(errorResponse.status).send(errorResponse);
    }
  },
};
