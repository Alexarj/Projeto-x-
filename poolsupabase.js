// poolSupabase.js
import { createClient } from '@supabase/supabase-js';

// ============================================
// Conexão com Supabase usando chave secreta
// ============================================
const supabaseUrl = 'https://sfaqtbhhbbvkfmgsryya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYXF0YmhoYmJ2a2ZtZ3NyeXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzk3MjQsImV4cCI6MjA4NDYxNTcyNH0.L2go96hlLBz8a_MLcnrs11tJ8AgDqe0128BBSjD2mUk';
export const supabase = createClient(supabaseUrl, supabaseKey);

// ================================
// FUNÇÕES DO POOL
// ================================

// Reservar valor do pool para aposta
export async function reservarPool(valor){
  const { data, error } = await supabase
    .from('pool')
    .select('balance')
    .single();

  if(error){
    alert("Erro ao acessar pool: "+error.message);
    return false;
  }

  if(valor > data.balance){
    alert("Saldo do pool insuficiente para esta aposta.");
    return false;
  }

  // Diminuir saldo do pool temporariamente
  const { error:updateError } = await supabase
    .from('pool')
    .update({ balance: data.balance - valor })
    .eq('id', 1);

  if(updateError){
    alert("Erro ao reservar pool: "+updateError.message);
    return false;
  }

  return true;
}

// Encerrar aposta e distribuir lucro ou prejuízo com 70/30
export async function encerrarAposta(valorFinal, lucro){
  const { data: users, error } = await supabase
    .from('pool_users')
    .select('*');

  if(error){
    alert("Erro ao acessar usuários do pool: "+error.message);
    return;
  }

  const { data: poolData, error: poolError } = await supabase
    .from('pool')
    .select('balance')
    .single();

  if(poolError){
    alert("Erro ao acessar pool: "+poolError.message);
    return;
  }

  const totalPool = poolData.balance;
  const resultado = valorFinal - totalPool;

  if(lucro && resultado > 0){
    const usuariosLucro = resultado * 0.7; // 70% para usuários
    const traderLucro = resultado * 0.3;   // 30% para trader

    // Atualiza saldo da carteira do trader
    const { data: traderData, error: traderError } = await supabase
      .from('trader_wallet')
      .select('balance')
      .single();

    if(traderError){
      // Se não existir carteira do trader, cria
      await supabase.from('trader_wallet').insert([{ balance: traderLucro }]);
    } else {
      await supabase
        .from('trader_wallet')
        .update({ balance: traderData.balance + traderLucro })
        .eq('id', traderData.id);
    }

    // Distribuição proporcional para usuários
    const totalUsuarios = users.reduce((sum,u)=>sum+u.valor,0);
    for(let u of users){
      const proporcao = u.valor / totalUsuarios;
      const delta = usuariosLucro * proporcao;
      await supabase
        .from('pool_users')
        .update({ valor: u.valor + delta })
        .eq('id', u.id);
    }

  } else if(!lucro && resultado < 0){
    // Prejuízo deduzido proporcionalmente dos usuários
    const totalUsuarios = users.reduce((sum,u)=>sum+u.valor,0);
    for(let u of users){
      const proporcao = u.valor / totalUsuarios;
      const delta = resultado * proporcao; // resultado negativo
      await supabase
        .from('pool_users')
        .update({ valor: u.valor + delta }) // delta é negativo
        .eq('id', u.id);
    }
  }

  // Atualiza saldo total do pool
  await supabase
    .from('pool')
    .update({ balance: valorFinal })
    .eq('id', 1);

  alert("Pool e carteira do trader atualizados após encerramento da aposta.");
}

// ================================
// FUNÇÕES DE USUÁRIO
// ================================

// Transferir usuário para o pool
export async function transferirUsuario(usuario, valor){
  if(valor < 20){
    alert("Valor mínimo para transferir ao pool: R$20");
    return;
  }

  const { data, error } = await supabase
    .from('pool_users')
    .select('*')
    .eq('nome', usuario)
    .single();

  if(error && error.code !== 'PGRST116'){ 
    alert("Erro ao acessar usuário: "+error.message);
    return;
  }

  if(data){
    await supabase
      .from('pool_users')
      .update({ valor: data.valor + valor })
      .eq('id', data.id);
  } else {
    await supabase
      .from('pool_users')
      .insert([{ nome: usuario, valor: valor }]);
  }

  // Atualiza saldo total do pool
  const { data: poolData, error: poolError } = await supabase
    .from('pool')
    .select('balance')
    .single();

  if(poolError){
    alert("Erro ao acessar pool: "+poolError.message);
    return;
  }

  await supabase
    .from('pool')
    .update({ balance: poolData.balance + valor })
    .eq('id', 1);

  alert(`R$${valor} transferidos para o pool com sucesso!`);
}

// Saque do usuário do pool
export async function saqueUsuario(usuario, valor){
  if(valor < 20){
    alert("Saque mínimo permitido: R$20");
    return;
  }

  const { data, error } = await supabase
    .from('pool_users')
    .select('*')
    .eq('nome', usuario)
    .single();

  if(error || !data){
    alert("Usuário não encontrado ou erro: "+(error?error.message:""));
    return;
  }

  if(valor > data.valor){
    alert("Saldo insuficiente para saque.");
    return;
  }

  // Atualiza usuário
  await supabase
    .from('pool_users')
    .update({ valor: data.valor - valor })
    .eq('id', data.id);

  // Atualiza saldo total do pool
  const { data: poolData, error: poolError } = await supabase
    .from('pool')
    .select('balance')
    .single();

  if(poolError){
    alert("Erro ao acessar pool: "+poolError.message);
    return;
  }

  await supabase
    .from('pool')
    .update({ balance: poolData.balance - valor })
    .eq('id', 1);

  alert(`Saque de R$${valor} realizado com sucesso!`);
        }
