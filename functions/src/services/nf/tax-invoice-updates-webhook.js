module.exports = {
  async call(req, res) {
    // Processar a notificação recebida do eNotas
    const webhookData = req.body;

    // Verificar se é uma notificação válida
    if (webhookData && webhookData.tipo === "NFS-e") {
      // Aqui você pode realizar a lógica necessária com os dados do webhook
      console.log("Notificação do Webhook:", webhookData);

      // Responder ao eNotas para confirmar o recebimento da notificação
      res.status(200).json({ message: "Notificação recebida com sucesso." });
    } else {
      // Responder com erro para notificações inválidas
      res.status(400).json({ error: "Notificação inválida." });
    }
  },
};
