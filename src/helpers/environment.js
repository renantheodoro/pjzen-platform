export const isLocalhost = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return true;
  }
  return false;
};
