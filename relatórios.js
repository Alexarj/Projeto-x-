// relatorios.js - gera relatórios dinâmicos do pool

function gerarRelatorioUsuarios(){
  let relatorio = poolPlanoB.usuarios.map(u => ({
    nome: u.nome,
    saldo: u.saldo.toFixed(2)
  }));
  return relatorio;
}

function gerarRelatorioTrades(){
  return poolPlanoB.trades.map(t => ({
    evento: t.evento,
    valor: t.valor,
    resultado: t.resultado,
    hora: t.timestamp.toLocaleString()
  }));
}

function gerarRelatorioTrader(){
  return {
    lucroTrader: poolPlanoB.traderLucro.toFixed(2)
  };
}
