const axios = require("axios");

const apiKey = "sua_chave_de_api";
const baseURL = "https://api.enotasgw.com.br/v1";

module.exports = {
  async call(req, res) {
    try {
      const empresaId = req.params.empresaId;
      const notaFiscalId = req.params.id;
      const apiUrl = `${baseURL}/empresas/${empresaId}/nfes/${notaFiscalId}`;

      const response = await axios.delete(apiUrl, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const resultado = response.data;

      console.log("Resultado do Cancelamento da Nota Fiscal:", resultado);

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
          error: `Erro no cancelamento da nota fiscal. Código de status: ${error.response.status}`,
        });
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta do servidor
        console.error("Não houve resposta do servidor.");
        res.status(500).json({
          error:
            "Erro no cancelamento da nota fiscal. Não houve resposta do servidor.",
        });
      } else {
        // Ocorreu um erro durante a configuração da requisição
        console.error("Erro na configuração da requisição:", error.message);
        res.status(500).json({
          error:
            "Erro no cancelamento da nota fiscal. Erro na configuração da requisição.",
        });
      }
    }
  },
};
