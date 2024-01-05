import createAuthentication from "@/services/back-end/create-authentication-api";
import createAccountancy from "@/services/back-end/create-accountancy-api";

export default async function (form) {
  try {
    if (!form.firstName || typeof form.firstName !== "string") {
      console.error("O campo 'firstName' é obrigatório e deve ser uma string.");
      return;
    }

    if (!form.lastName || typeof form.lastName !== "string") {
      console.error("O campo 'lastName' é obrigatório e deve ser uma string.");
      return;
    }

    if (!form.email || typeof form.email !== "string") {
      console.error("O campo 'email' é obrigatório e deve ser uma string.");
      return;
    }

    if (!form.phone || typeof form.phone !== "string") {
      console.error("O campo 'phone' é obrigatório e deve ser uma string.");
      return;
    }

    if (!form.company || typeof form.company !== "string") {
      console.error("O campo 'company' é obrigatório e deve ser uma string.");
      return;
    }

    if (!form.cnpj || typeof form.cnpj !== "string") {
      console.error("O campo 'cnpj' é obrigatório e deve ser uma string.");
      return;
    }

    if (!form.clientsNumber || typeof form.clientsNumber !== "string") {
      console.error(
        "O campo 'clientsNumber' é obrigatório e deve ser uma string."
      );
      return;
    }

    if (!form.serviceType || typeof form.serviceType !== "string") {
      console.error(
        "O campo 'serviceType' é obrigatório e deve ser uma string."
      );
      return;
    }

    const { email, password } = form;

    // Realizar o registro do usuário no Firebase Authentication
    const accountancyUser = await createAuthentication(email, password);

    const accountancyData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      company: form.company,
      cnpj: form.cnpj,
      clientsNumber: form.clientsNumber,
      serviceType: form.serviceType,
    };

    const docId = await createAccountancy(accountancyUser.uid, accountancyData);

    // Salva o docId gerado
    accountancyData.uid = docId;

    console.log("Usuário registrado com sucesso!", accountancyUser);
    console.log("Conta contábil adicionada ao Firestore com ID:", docId);

    return accountancyData;
  } catch (error) {
    const errorMessage = error.message;
    console.error("[REGISTER ACCOUNTANCY SERVICE] Message ->", errorMessage);
    throw errorMessage;
  }
}
