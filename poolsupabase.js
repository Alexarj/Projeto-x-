// poolSupabase.js
import { supabase } from './supabaseConfig.js';

// Adicionar usuário ao pool
export async function adicionarUsuario(nome, email, depositoInicial){
  if(!nome || !email || isNaN(depositoInicial)){
    alert('Preencha todos os campos corretamente!');
    return;
  }

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome, email, saldo: depositoInicial, criado_em: new Date() }]);
  
  if(error){
    console.error(error);
    alert('Erro ao adicionar usuário: ' + error.message);
  } else {
    console.log('Usuário adicionado:', data);
    alert('Usuário adicionado com sucesso!');
  }
}

// Registrar trade no pool
export async function registrarTrade(evento, valorTrade, resultadoPercentual){
  if(!evento || isNaN(valorTrade) || isNaN(resultadoPercentual)){
    alert('Preencha todos os campos corretamente!');
    return;
  }

  const { data: usuarios, error } = await supabase.from('usuarios').select('*');
  if(error){ console.error(error); return; }

  const saldoTotal = usuarios.reduce((acc, u) => acc + u.saldo, 0);

  let updates = usuarios.map(u => {
    let valorReservado = (u.saldo / saldoTotal) * valorTrade;
    let novoSaldo = u.saldo;

    if(resultadoPercentual > 0){
      novoSaldo += valorReservado * resultadoPercentual * 0.7; // lucro usuário
    } else {
      novoSaldo -= valorReservado * Math.abs(resultadoPercentual); // perda do usuário
    }
    return { id: u.id, saldo: novoSaldo };
  });

  for(let u of updates){
    await supabase.from('usuarios').update({ saldo: u.saldo }).eq('id', u.id);
  }

  const { data: tradeData, error: tradeError } = await supabase
    .from('pool_trades')
    .insert([{ evento, valor: valorTrade, resultado: resultadoPercentual, timestamp: new Date() }]);

  if(tradeError) console.error(tradeError);
  else console.log('Trade registrado:', tradeData);
}

// Relatórios
export async function relatorioUsuarios(){
  const { data, error } = await supabase.from('usuarios').select('*');
  if(error){ console.error(error); return; }
  console.table(data);
}

export async function relatorioTrades(){
  const { data, error } = await supabase.from('pool_trades').select('*');
  if(error){ console.error(error); return; }
  console.table(data);
}
