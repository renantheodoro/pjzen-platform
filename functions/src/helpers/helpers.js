function separateNeighborhoodPrefix(neighborhoodName) {
  // List of common prefixes in Brazilian neighborhood names, along with their corresponding abbreviations
  const prefixes = {
    bairro: ["bairro"],
    vila: ["vila", "vl"],
    jardim: ["jardim", "jd"],
    centro: ["centro"],
    parque: ["parque", "pq"],
    alameda: ["alameda", "al"],
    avenida: ["avenida", "av"],
    travessa: ["travessa", "tv"],
    rua: ["rua"],
    estrada: ["estrada", "est"],
    largo: ["largo", "lg"],
    praça: ["praça", "pra"],
    rodovia: ["rodovia", "rod"],
  };

  // Iterate through the list of prefixes and check if the neighborhood name starts with any of them
  for (let neighborhoodType in prefixes) {
    for (let prefix of prefixes[neighborhoodType]) {
      if (neighborhoodName.toLowerCase().startsWith(prefix)) {
        // If a prefix is found, return the neighborhood type and the name without the prefix
        return {
          type: neighborhoodType,
          name: neighborhoodName.substring(prefix.length).trim(), // Remove the prefix from the neighborhood name
        };
      }
    }
  }

  // If no prefix is found, return null for the neighborhood type and the original neighborhood name
  return {
    type: null,
    name: neighborhoodName,
  };
}

function separateStreetType(streetName) {
  // Lista de tipos comuns de logradouro no Brasil, juntamente com suas abreviações correspondentes
  const types = {
    avenida: ["avenida", "av"],
    rua: ["rua", "r"],
    estrada: ["estrada", "est"],
    travessa: ["travessa", "tv"],
    praça: ["praça", "pq"],
    boulevard: ["boulevard", "blvd"],
    caminho: ["caminho", "cm"],
    beco: ["beco", "bc"],
    alameda: ["alameda", "al"],
    largo: ["largo", "lg"],
    via: ["via", "vi"],
    rotatória: ["rotatória", "rot"],
    passeio: ["passeio", "ps"],
    viela: ["viela", "vl"],
    subpassagem: ["subpassagem", "sub"],
    ponte: ["ponte", "pn"],
    entroncamento: ["entroncamento", "ent"],
    viaduto: ["viaduto", "vd"],
    corredor: ["corredor", "cor"],
    autoestrada: ["autoestrada", "ae"],
    esquina: ["esquina", "esq"],
    reta: ["reta", "rt"],
    travessia: ["travessia", "trav"],
  };

  // Percorre a lista de tipos e verifica se o nome do logradouro começa com algum deles
  for (let type in types) {
    for (let prefix of types[type]) {
      if (streetName.toLowerCase().startsWith(prefix)) {
        // Se encontrar um tipo, retorna o tipo de logradouro e o nome sem o tipo
        return {
          type: type,
          name: streetName.substring(prefix.length).trim(), // Remove o tipo do nome do logradouro
        };
      }
    }
  }

  // Se nenhum tipo for encontrado, retorna null para o tipo de logradouro e o nome do logradouro original
  return {
    type: null,
    name: streetName,
  };
}

function getTaxRegimeCode(taxRegimeDescription) {
  switch (taxRegimeDescription) {
    case "Simples Nacional":
      return 1;
    case "Simples Nacional - Excesso":
      return 2;
    case "Regime Normal - Lucro Presumido":
      return 3;
    case "Normal - Lucro Real":
      return 4;

    default:
      return 0; // Nenhum
  }
}

function separateNumberFromDDDFromPhone(phone) {
  // Remover parênteses e hífen
  const phoneFormatted = phone.replace(/[()-]/g, "");

  // Extrair DDD e número
  const ddd = phoneFormatted.substring(0, 2);
  const numero = phoneFormatted.substring(2);

  return {
    ddd,
    numero,
  };
}

module.exports = {
  separateNeighborhoodPrefix,
  separateStreetType,
  getTaxRegimeCode,
  separateNumberFromDDDFromPhone,
};
