export function formatCurrency(valor) {
  // Verificar se o valor é uma string e remover qualquer formatação existente
  if (typeof valor === "string") {
    valor = valor.replace(/[^\d,.-]/g, "");
  }

  // Converter para número
  valor = parseFloat(valor);

  // Verificar se o valor é um número
  if (!isNaN(valor)) {
    // Formatar como moeda brasileira (BRL)
    var valorFormatado = valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return valorFormatado;
  } else {
    // Se o valor não for numérico, retornar o valor original
    return valor;
  }
}

export function parseCurrencyToFloat(value) {
  // Remover o "R$" (caso exista) e substituir o ponto por nada e a vírgula por ponto
  const formattedValue = value
    .replace("R$", "")
    .trim()
    .replace(/\./g, "")
    .replace(",", ".");

  // Converter para float
  const floatValue = parseFloat(formattedValue);

  return floatValue;
}

export function parseFloatToCurrency(valor) {
  // Verificar se o valor é um número
  if (typeof valor === "number") {
    // Formatar como moeda brasileira (BRL)
    var valorFormatado = valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return valorFormatado;
  } else {
    // Se o valor não for numérico, retornar o valor original
    return valor;
  }
}
