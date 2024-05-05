export default function getOperationNatureFromId(id) {
  switch (id) {
    case "1":
    case 1:
      return "Simples Nacional";
    case "2":
    case 2:
      return "Fixo";
    case "3":
    case 3:
      return "Depósito em Juízo";
    case "4":
    case 4:
      return "Exigibilidade suspensa por decisão judicial";
    case "5":
    case 5:
      return "Exigibilidade suspensa por procedimento administrativo";
    case "6":
    case 6:
      return "Isenção parcial";
    default:
      return "";
  }
}
