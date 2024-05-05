import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

// Função para reautenticar o usuário com sua senha atual
export default async function reauthenticateUser(email, password) {
  const auth = getAuth();
  const credential = EmailAuthProvider.credential(email, password);

  try {
    await reauthenticateWithCredential(auth.currentUser, credential);
    return true;
  } catch (error) {
    return false;
  }
}
