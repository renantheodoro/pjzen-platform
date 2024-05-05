export default function getDateByTimestamp(timestamp) {
    const date = new Date(timestamp.seconds * 1000); // Convertendo segundos para milissegundos
    
    const day = String(date.getDate()).padStart(2, '0'); // Obtém o dia, preenchendo com zero à esquerda se for necessário
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtém o mês, preenchendo com zero à esquerda se for necessário
    const year = date.getFullYear(); // Obtém o ano
    
    return `${day}.${month}.${year}`;
}
