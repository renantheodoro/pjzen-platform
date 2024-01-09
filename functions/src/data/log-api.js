const { log, error } = require("firebase-functions/logger");

const logApi = (apiServiceTitle, message, details) => {
  if (details) {
    log(`[API] ${apiServiceTitle} -> ${message}: "${details}"`);
  } else {
    log(`[API] ${apiServiceTitle} -> ${message}`);
  }
};

const errorApi = (apiServiceTitle, message, details) => {
  if (details) {
    error(`[API] ${apiServiceTitle} -> ${message}: "${details}"`);
  } else {
    error(`[API] ${apiServiceTitle} -> ${message}.`);
  }
};

module.exports = { logApi, errorApi };
