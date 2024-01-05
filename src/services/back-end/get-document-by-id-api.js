import { db } from "@/services/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import errorHandler from "./errors/error-handler";

export default async function getDocumentById(collectionName, documentId) {
  try {
    // Criar uma referência para o documento na coleção especificada
    const documentRef = doc(db, collectionName, documentId);

    // Buscar o documento no banco de dados
    const documentSnap = await getDoc(documentRef);

    if (documentSnap.exists()) {
      // Retornar os dados do documento se ele existir
      return documentSnap.data();
    } else {
      throw new Error("error/not-found");
    }
  } catch (error) {
    const errorMessage = errorHandler(error);
    console.error("[GET ACCOUNTANCY API] Message ->", errorMessage);
    throw {
      message: errorMessage,
    };
  }
}
