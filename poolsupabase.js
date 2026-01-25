// poolSupabase.js
import { supabase } from './supabaseConfig.js';
import { apostarEvento, atualizarSaldo } from './poolPinnacle.js';

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

  // 1️⃣ Preparar aposta proporcional (sem enviar ainda)
  await apostarEvento(evento, valorTrade, 'back'); // tipo 'back', pode ser parametrizado

  // 2️⃣ Atualizar saldo proporcional de cada usuário
  await atualizarSaldo(resultadoPercentual, valorTrade);

  // 3️⃣ Registrar no histórico
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
