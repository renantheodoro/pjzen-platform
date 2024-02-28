import { errorLog } from "@/helpers/log";

export const validateStringField = (field, value) => {
  if (!value || typeof value !== "string") {
    errorLog(`O campo '${field}' é obrigatório e deve ser uma string.`);
    return false;
  }
  return true;
};

export const validateNumberField = (field, value) => {
  if (isNaN(value)) {
    errorLog(`O campo '${field}' é obrigatório e deve ser um número.`);
    return false;
  }
  return true;
};

export const validateEmailField = (field, value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    errorLog(`O campo '${field}' é obrigatório e deve ser um email válido.`);
    return false;
  }
  return true;
};

export const validatePhoneField = (field, value) => {
  const phoneRegex = /^\(\d{2}\) 9?\d{4,5}-\d{4}$/;
  if (!phoneRegex.test(value)) {
    errorLog(
      `O campo '${field}' é obrigatório e deve ter um formato de telefone válido.`
    );
    return false;
  }
  return true;
};

export const validateCepField = (field, value) => {
  const cepRegex = /^\d{5}-\d{3}$/;
  if (!cepRegex.test(value)) {
    errorLog(
      `O campo '${field}' é obrigatório e deve ter um formato de CEP válido.`
    );
    return false;
  }
  return true;
};

export const validateFileField = (field, value) => {
  if (!(value instanceof Blob)) {
    errorLog(`O campo '${field}' deve ser um objeto 'Blob' válido.`);
    return false;
  }

  const limitSize = 300 * 1024 * 1024; // 300mb

  if (value.size > limitSize) {
    errorLog(`O arquivo no campo '${field}' deve ter no máximo 300 MB.`);
    return false;
  }

  console.log("uhuuu");

  return true;
};
