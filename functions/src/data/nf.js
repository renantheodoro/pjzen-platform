// Exemplo de uso
// const statusEmissao = EmissaoStatus.AGUARDANDO_AUTORIZACAO;
// const statusCancelamento = CancelamentoStatus.SOLICITANDO_CANCELAMENTO;

// Interface para status de emissão da nota fiscal
export const EmissaoStatus = {
  AGUARDANDO_AUTORIZACAO: "AguardandoAutorizacao",
  SOLICITANDO_AUTORIZACAO: "SolicitandoAutorizacao",
  AUTORIZACAO_SOLICITADA: "AutorizacaoSolicitada",
  EM_PROCESSO_DE_AUTORIZACAO: "EmProcessoDeAutorizacao",
  AUTORIZADA_AGUARDANDO_GERACAO_PDF: "AutorizadaAguardandoGeracaoPDF",
  AUTORIZADA: "Autorizada",
  NEGADA: "Negada",
};

// Interface para status de cancelamento da nota fiscal
export const CancelamentoStatus = {
  SOLICITANDO_CANCELAMENTO: "SolicitandoCancelamento",
  CANCELAMENTO_SOLICITADO: "CancelamentoSolicitado",
  EM_PROCESSO_DE_CANCELAMENTO: "EmProcessoDeCancelamento",
  CANCELADA_AGUARDANDO_ATUALIZACAO_PDF: "CanceladaAguardandoAtualizacaoPDF",
  CANCELADA: "Cancelada",
  CANCELAMENTO_NEGADO: "CancelamentoNegado",
};
