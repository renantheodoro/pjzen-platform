export default (document) => {
  const cleanDocument = document.replace(/[^\d]/g, "");
  return cleanDocument;
};
