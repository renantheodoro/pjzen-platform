import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import errorHandler from "./errors/error-handler";

export default async function (email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    const errorMessage = errorHandler(error);
    console.error("[CREATE AUTHENTICATION API] Message ->", errorMessage);
    throw {
      message: errorMessage,
    };
  }
}
