const axios = require("axios");
const plugNotasErrorHandler = require("../../../data/plug-notas-error-handler");

const apiServiceTitle = "REGISTER DIGITAL CERTIFICATE";

function base64ToBinary(base64String) {
  const base64Data = base64String.split(",")[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

module.exports = {
  async call(certificateData) {
    try {
      const { fileBase64, password, email } = certificateData;
      const binaryData = base64ToBinary(fileBase64);

      const formData = new FormData();
      formData.append("arquivo", new Blob([binaryData]), "certificado.pfx");
      formData.append("senha", password);
      formData.append("email", email);

      const response = await axios.post(
        `${process.env.PLUG_NOTAS_BASE_URL_DEV}/certificado`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-KEY": process.env.PLUG_NOTAS_TOKEN_DEV,
          },
        }
      );

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
