export default function getMonthYearByTimestamp(timestamp) {
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const date = new Date(timestamp.seconds * 1000); // Convertendo segundos para milissegundos

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month}/${year}`;
}
