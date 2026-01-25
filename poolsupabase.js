// poolSupabase.js
import { supabase } from './supabaseConfig.js';

// Função para reservar saldo proporcional do pool
export async function reservarPool(valorTotal) {
  // Pega saldo disponível
  const { data: poolData, error } = await supabase
    .from('pool')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) { console.error(error); return false; }

  if (poolData.saldo < valorTotal) {
    alert("Saldo insuficiente no pool!");
    return false;
  }

  // Atualiza saldo bloqueado
  const { error:updateError } = await supabase
    .from('pool')
    .update({ saldo_bloqueado: poolData.saldo_bloqueado + valorTotal })
    .eq('id', 1);

  if (updateError) { console.error(updateError); return false; }

  return true;
}

// Função para liberar o saldo do pool e calcular lucro/perda
export async function encerrarAposta(valor, lucro=true) {
  const { data: poolData, error } = await supabase
    .from('pool')
    .select('*')
    .eq('id',1)
    .single();

  if (error) { console.error(error); return; }

  let saldoAtual = poolData.saldo;
  let saldoBloqueado = poolData.saldo_bloqueado;

  // Calcula lucro 70/30 ou perda proporcional
  let ajuste = 0;
  if (lucro) {
    ajuste = valor * 0.7; // 70% para usuários
  } else {
    ajuste = -valor; // perda total dos usuários
  }

  const { error:updateError } = await supabase
    .from('pool')
    .update({ 
      saldo: saldoAtual + ajuste,
      saldo_bloqueado: saldoBloqueado - valor
    })
    .eq('id',1);

  if (updateError) console.error(updateError);
}

// Função para obter saldo do pool
export async function getPool() {
  const { data, error } = await supabase
    .from('pool')
    .select('*')
    .eq('id',1)
    .single();

  if (error) { console.error(error); return null; }
  return data;
    }
