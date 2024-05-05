export default function formatDateToString(dateString) {
  // Converte a string em uma instância de Date
  const date = new Date(dateString);

  // Extrai o dia, mês e ano da data
  const day = String(date.getDate()).padStart(2, "0"); // Adiciona um zero à esquerda se for necessário
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Os meses em JavaScript começam do zero
  const year = date.getFullYear();

  // Retorna a data formatada no formato dd/mm/aaaa
  return `${day}/${month}/${year}`;
}
