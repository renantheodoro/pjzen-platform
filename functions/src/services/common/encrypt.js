const CryptoJS = require("crypto-js");

const encryptedKey = process.env.API_KEY;

const decrypt = (data) => {
  try {
    if (!encryptedKey) {
      throw new Error("API key is undefined or null.");
    }

    const bytes = CryptoJS.AES.decrypt(data, encryptedKey);

    if (!bytes) {
      throw new Error("Decryption failed.");
    }

    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      throw new Error("Decrypted data is undefined or null.");
    }

    const parsedData = JSON.parse(decryptedData);

    if (!parsedData) {
      throw new Error("Parsed data is undefined or null.");
    }

    return parsedData;
  } catch (error) {
    console.error("Error during decryption:", error.message);
    return null;
  }
};

const encrypt = (data) => {
  try {
    if (!encryptedKey) {
      throw new Error("API key is undefined or null.");
    }

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      encryptedKey
    ).toString();

    if (!encryptedData) {
      throw new Error("Encryption failed.");
    }

    return encryptedData;
  } catch (error) {
    console.error("Error during encryption:", error.message);
    return null;
  }
};

module.exports = { decrypt, encrypt };
