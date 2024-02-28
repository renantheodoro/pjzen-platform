const axios = require("axios");

const apiKey = "sua_chave_de_api";
const baseURL = "https://api.enotasgw.com.br/v1";

module.exports = {
  async call(req, res) {
    try {
      const apiUrl = `${baseURL}/empresas/${req.params.id}`;
      const requestBody = req.body;

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const empresaInfo = response.data;

      console.log("Informações da Empresa incluídas/atualizadas:", empresaInfo);

      // Enviar uma resposta para o cliente
      res.status(200).json(empresaInfo);
    } catch (error) {
      if (error.response) {
        // O servidor respondeu com um código de status diferente de 2xx
        console.error(
          "Erro na resposta do servidor:",
          error.response.status,
          error.response.data
        );
        res.status(error.response.status).json({
          error: `Erro na inclusão/atualização da empresa. Código de status: ${error.response.status}`,
        });
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta do servidor
        console.error("Não houve resposta do servidor.");
        res.status(500).json({
          error:
            "Erro na inclusão/atualização da empresa. Não houve resposta do servidor.",
        });
      } else {
        // Ocorreu um erro durante a configuração da requisição
        console.error("Erro na configuração da requisição:", error.message);
        res.status(500).json({
          error:
            "Erro na inclusão/atualização da empresa. Erro na configuração da requisição.",
        });
      }
    }
  },
};
