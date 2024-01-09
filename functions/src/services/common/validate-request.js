const CryptoJS = require("crypto-js");
const apiKey = process.env.API_KEY;

// Função para criar um hash SHA-256 usando CryptoJS
const createSHA256Hash = (data) => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
};

const hashApiKey = createSHA256Hash(apiKey);

const validateRequest = async (key) => {
  const inputHash = createSHA256Hash(key);
  return inputHash === hashApiKey;
};

module.exports = validateRequest;
