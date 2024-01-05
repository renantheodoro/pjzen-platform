import { db } from "../config/firebase";
import { setDoc, doc, collection, serverTimestamp } from "firebase/firestore";
import errorHandler from "./errors/error-handler";
import { ACCOUNTANCIES_COLLECTION } from "./const/collections";

export default async function createAccountancy(uid, data) {
  try {
    const accountanciesCollection = collection(db, ACCOUNTANCIES_COLLECTION);
    const accountancyData = {
      ...data,
      createdAt: serverTimestamp(),
      lastModifiedAt: serverTimestamp(),
    };

    // Criar uma referência para o documento com o UID como ID
    const accountancyDocRef = doc(accountanciesCollection, uid);

    // Setar os dados do documento
    await setDoc(accountancyDocRef, accountancyData);

    // Retornar o UID
    return uid;
  } catch (error) {
    const errorMessage = errorHandler(error);
    console.error("[CREATE ACCOUNTANCY API] Message ->", errorMessage);
    throw {
      message: errorMessage,
    };
  }
}
