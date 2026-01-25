// poolPinnacle.js

// Placeholder: enviar aposta para Pinnacle
export async function enviarApostaPinnacle(match, market, type, valor, odd){
  console.log(`Enviando aposta para Pinnacle: ${match} | ${market} | ${type.toUpperCase()} | R$${valor} @${odd}`);
  // Aqui você chamaria a API real da Pinnacle usando fetch ou axios
  // Exemplo:
  // await fetch("API_URL", { method:"POST", body:JSON.stringify({...}) })
}

// Placeholder: atualizar odds ao vivo
export async function atualizarOdds(match){
  // Aqui você chamaria a API Pinnacle para pegar odds atualizadas
  // Exemplo de retorno simulado
  return [
    { market:"Vitória Time A", back:(Math.random()*2+1).toFixed(2), lay:(Math.random()*2+1).toFixed(2) },
    { market:"Vitória Time B", back:(Math.random()*2+1).toFixed(2), lay:(Math.random()*2+1).toFixed(2) }
  ];
}
