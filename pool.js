// pool.js - gerencia o Plano B para usuários reais

let poolPlanoB = {
  saldoTotal: 0,
  usuarios: [],   // lista de usuários reais
  trades: [],     // histórico de trades
  traderLucro: 0
};

// Adicionar usuário ao pool
function adicionarUsuario(nome, depositoInicial){
  poolPlanoB.usuarios.push({
    nome: nome,
    saldo: depositoInicial,
    valorReservado: 0
  });
  poolPlanoB.saldoTotal += depositoInicial;
}

// Reservar valores proporcionalmente ao trade
function reservarTrade(valorTrade){
  poolPlanoB.usuarios.forEach(u => {
    u.valorReservado = (u.saldo / poolPlanoB.saldoTotal) * valorTrade;
  });
}

// Atualizar saldo após trade (lucro/perda)
function atualizarSaldo(resultadoPercentual){
  poolPlanoB.usuarios.forEach(u => {
    if(resultadoPercentual > 0){
      let lucroUsuario = u.valorReservado * resultadoPercentual * 0.7;
      let lucroTrader = u.valorReservado * resultadoPercentual * 0.3;
      u.saldo += lucroUsuario;
      poolPlanoB.traderLucro += lucroTrader;
    } else {
      u.saldo -= u.valorReservado * Math.abs(resultadoPercentual);
    }
    u.valorReservado = 0;
  });
  poolPlanoB.saldoTotal = poolPlanoB.usuarios.reduce((acc, u) => acc + u.saldo, 0);
}

// Registrar trade no histórico
function registrarTrade(nomeEvento, valorTrade, resultadoPercentual){
  reservarTrade(valorTrade);
  atualizarSaldo(resultadoPercentual);
  poolPlanoB.trades.push({
    evento: nomeEvento,
    valor: valorTrade,
    resultado: resultadoPercentual,
    timestamp: new Date()
  });
}
