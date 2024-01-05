import loginWithEmailAndPassword from "@/services/back-end/login-with-email-and-password-api";
import getDocumentById from "@/services/back-end/get-document-by-id-api";
import { ACCOUNTANCIES_COLLECTION } from "@/services/back-end/const/collections";

export default async function loginUser(form) {
  try {
    // Validações dos campos dentro do objeto form
    if (!form.email || typeof form.email !== "string") {
      throw new Error("O campo 'email' é obrigatório e deve ser uma string.");
    }

    if (!form.password || typeof form.password !== "string") {
      throw new Error(
        "O campo 'password' é obrigatório e deve ser uma string."
      );
    }

    const { email, password } = form;

    const loginUser = await loginWithEmailAndPassword(email, password);

    const accountancyResponse = await getDocumentById(
      ACCOUNTANCIES_COLLECTION,
      loginUser.uid
    );

    const loginServiceResponse = {
      loginData: {
        accessToken: loginUser.accessToken,
        emailVerified: loginUser.emailVerified,
        uid: loginUser.uid,
        email: loginUser.email,
      },
      accountancyInfo: {
        firstName: accountancyResponse.firstName,
        lastName: accountancyResponse.lastName,
        clientsNumber: accountancyResponse.clientsNumber,
        cnpj: accountancyResponse.cnpj,
        company: accountancyResponse.company,
        createdAt: accountancyResponse.createdAt,
        email: accountancyResponse.email,
        lastModifiedAt: accountancyResponse.lastModifiedAt,
        phone: accountancyResponse.phone,
        serviceType: accountancyResponse.serviceType,
      },
    };

    console.log("Login realizado com sucesso!", loginUser);

    return loginServiceResponse;
  } catch (error) {
    const errorMessage = error.message;
    console.error("[LOGIN SERVICE] Message ->", errorMessage);
    throw errorMessage;
  }
}
