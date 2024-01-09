const getCleanCNPJ = (cnpj) => {
  const documentId = cnpj.replace(/[/.-]/g, "");
  return documentId;
};

module.exports = {
  getCleanCNPJ,
};
