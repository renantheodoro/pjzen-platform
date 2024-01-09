export const logger = (text) => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "1270.0.1"
  ) {
    console.log(`[CLIENT] -> ${text}`);
  }
};

export const errorLog = (text) => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.error(`[CLIENT ERROR] -> ${text}`);
  }
};
