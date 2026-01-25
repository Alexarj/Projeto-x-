// poolSupabase.js
import { createClient } from '@supabase/supabase-js';

// Conexão Supabase
const supabaseUrl = 'https://sfaqtbhhbbvkfmgsryya.supabase.co';
const supabaseKey = 'sb_secret_R5nGU'; // usar environment variable em produção
export const supabase = createClient(supabaseUrl, supabaseKey);

// Obter saldo total do pool
export async function getPool(){
  const { data, error } = await supabase
    .from('pool')
    .select('*')
    .eq('id', 1)
    .single();

  if(error) { console.error(error); return null; }
  return data;
}

// Reservar saldo proporcional
export async function reservarPool(valor){
  const pool = await getPool();
  if(!pool || pool.saldo < valor){
    alert("Saldo insuficiente no pool");
    return false;
  }

  const novoSaldo = pool.saldo - valor;
  const { error } = await supabase
    .from('pool')
    .update({ saldo: novoSaldo })
    .eq('id', 1);

  if(error) { console.error(error); alert("Erro ao reservar pool"); return false; }
  return true;
}

// Encerrar aposta e distribuir lucro/perda
export async function encerrarAposta(valorFinal, lucro){
  const pool = await getPool();
  let novoSaldo;
  if(lucro){
    // 70% trader, 30% usuários
    const usuarios = valorFinal * 0.3;
    novoSaldo = pool.saldo + usuarios;
  }else{
    // perda: apenas usuários impactados
    novoSaldo = pool.saldo;
  }

  const { error } = await supabase
    .from('pool')
    .update({ saldo: novoSaldo })
    .eq('id', 1);

  if(error) console.error(error);
}
