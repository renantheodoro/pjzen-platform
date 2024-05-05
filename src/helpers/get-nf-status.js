export const NF_STATUS_AWAITING_RETURN = "AWAITING_RETURN";
export const NF_STATUS_CANCELLED = "CANCELLED";
export const NF_STATUS_COMPLETED = "COMPLETED";
export const PLUG_NOTAS_STATUS_CONCLUIDO = "CONCLUIDO";

export function getPtStatusByNfStatus(nfStatus) {
  switch (nfStatus) {
    case NF_STATUS_COMPLETED:
      return {
        status: "active",
        content: "Emitida",
      };
    case NF_STATUS_AWAITING_RETURN:
      return {
        status: "waiting",
        content: "Aguardando processo",
      };
    case NF_STATUS_CANCELLED:
      return {
        status: "inactive",
        content: "Cancelada",
      };

    default:
      return {
        status: "inactive",
        content: "Erro",
      };
  }
}
