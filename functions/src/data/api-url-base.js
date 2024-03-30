function getApiUrlBase() {
  switch (process.env.NODE_ENV) {
    case "development":
      return process.env.API_URL_BASE_DEV;
    case "production":
      return process.env.API_URL_BASE_PROD;
    default:
      return process.env.API_URL_BASE_LOCAL;
  }
}

module.exports = getApiUrlBase;
