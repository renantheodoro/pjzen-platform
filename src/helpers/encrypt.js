import CryptoJS from "crypto-js";

const encryptedKey = process.env.VUE_APP_FIREBASE_APIKEY;

const encrypt = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    encryptedKey
  ).toString();
  return encryptedData;
};

const decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, encryptedKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  try {
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Error parsing decrypted data:", error);
    return null;
  }
};

export { encrypt, decrypt };
