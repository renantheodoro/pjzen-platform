const axios = require("axios");

const apiKey = "sua_chave_de_api";
const baseURL = "https://api.enotasgw.com.br/v1";

module.exports = {
  async call(req, res) {
    try {
      const empresaId = req.params.empresaId;
      const notaFiscalId = req.params.id;
      const apiUrl = `${baseURL}/empresas/${empresaId}/nfes/${notaFiscalId}/pdf`;

      const response = await axios.get(apiUrl, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        responseType: "arraybuffer", // Indica que a resposta é um array de bytes
      });

      // Configura os headers da resposta para indicar que é um PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=nota-fiscal-${notaFiscalId}.pdf`
      );

      // Envia o arquivo PDF como resposta
      res.send(response.data);
    } catch (error) {
      if (error.response) {
        // O servidor respondeu com um código de status diferente de 2xx
        console.error(
          "Erro na resposta do servidor:",
          error.response.status,
          error.response.data
        );
        res.status(error.response.status).json({
          error: `Erro ao fazer o download do PDF. Código de status: ${error.response.status}`,
        });
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta do servidor
        console.error("Não houve resposta do servidor.");
        res.status(500).json({
          error:
            "Erro ao fazer o download do PDF. Não houve resposta do servidor.",
        });
      } else {
        // Ocorreu um erro durante a configuração da requisição
        console.error("Erro na configuração da requisição:", error.message);
        res.status(500).json({
          error:
            "Erro ao fazer o download do PDF. Erro na configuração da requisição.",
        });
      }
    }
  },
};
