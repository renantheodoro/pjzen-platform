const getCleanDocument = (document) => {
  const cleanDocument = document.replace(/[^\d]/g, "");
  return cleanDocument;
};

module.exports = {
  getCleanDocument,
};
