const axios = require("axios");
const fs = require("fs");

const apiKey = "sua_chave_de_api";
const baseURL = "https://api.enotasgw.com.br/v1";

module.exports = {
  async call(req, res) {
    try {
      const empresaId = req.params.empresaId;
      const apiUrl = `${baseURL}/empresas/${empresaId}/certificadoDigital`;

      // Lê o arquivo do certificado digital e converte para base64
      const certificadoFile = req.file;
      const certificadoBase64 = fs.readFileSync(certificadoFile.path, {
        encoding: "base64",
      });

      const senha = req.body.senha;

      const response = await axios.post(
        apiUrl,
        {
          arquivo: certificadoBase64,
          senha: senha,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const resultado = response.data;

      console.log("Resultado do Vínculo do Certificado:", resultado);

      // Excluir o arquivo temporário após o uso
      fs.unlinkSync(certificadoFile.path);

      // Enviar uma resposta para o cliente
      res.status(200).json(resultado);
    } catch (error) {
      if (error.response) {
        // O servidor respondeu com um código de status diferente de 2xx
        console.error(
          "Erro na resposta do servidor:",
          error.response.status,
          error.response.data
        );
        res.status(error.response.status).json({
          error: `Erro ao vincular o certificado digital. Código de status: ${error.response.status}`,
        });
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta do servidor
        console.error("Não houve resposta do servidor.");
        res.status(500).json({
          error:
            "Erro ao vincular o certificado digital. Não houve resposta do servidor.",
        });
      } else {
        // Ocorreu um erro durante a configuração da requisição
        console.error("Erro na configuração da requisição:", error.message);
        res.status(500).json({
          error:
            "Erro ao vincular o certificado digital. Erro na configuração da requisição.",
        });
      }
    }
  },
};
