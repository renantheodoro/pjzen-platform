const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "REGISTER DIGITAL CERTIFICATE";

async function base64ToPfx(base64Data, outputPath) {
  return new Promise((resolve, reject) => {
    // Converter a string base64 para buffer
    const binaryData = Buffer.from(base64Data, "base64");

    // Escrever os dados binários em um arquivo .pfx
    fs.writeFile(outputPath, binaryData, "binary", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(outputPath);
      }
    });
  });
}

module.exports = {
  async call(certificateData) {
    try {
      // Extrai os parâmetros do corpo da solicitação
      const { fileBase64, password, email } = certificateData;

      console.log("file", fileBase64);
      console.log("password", password);
      console.log("email", email);

      // Converter o arquivo base64 para .pfx
      const outputPath = "certificado.pfx"; // Nome do arquivo .pfx temporário
      await base64ToPfx(fileBase64, outputPath);

      // Criar um objeto FormData
      const formData = new FormData();
      formData.append("arquivo", fs.createReadStream(outputPath), {
        filename: "certificado.pfx",
      });
      formData.append("senha", password);
      formData.append("email", email);

      // Fazer a solicitação POST
      const response = await axios.post(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/certificado`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

      console.log("--- response", response);

      if (response.status === 201) {
        return response.data;
      } else {
        return { message: "Erro interno do servidor", error: response };
      }
    } catch (error) {
      const errorResponse = plugNotasErrorHandler(error, apiServiceTitle);
      return errorResponse;
    }
  },
};
