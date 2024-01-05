import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import errorHandler from "./errors/error-handler";

export default async function (email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    const errorMessage = errorHandler(error);
    throw {
      message: errorMessage,
    };
  }
}
