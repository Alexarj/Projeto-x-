// poolPinnacle.js
import { supabase } from './supabaseConfig.js';
import axios from 'axios'; // se for Node.js, no front-end usar fetch

// Configurações da Pinnacle (preencher quando receber do suporte)
const PINNACLE_API = 'https://api.pinnacle.com/v2/';
let USERNAME = ''; // receber do suporte
let PASSWORD = ''; // receber do suporte

/**
 * Função para preparar aposta proporcional do pool
 * @param {string} eventoId - ID do evento a apostar
 * @param {number} valorTotal - Valor total que o trader deseja apostar
 * @param {'back'|'lay'} tipoAposta - Tipo de aposta
 */
export async function apostarEvento(eventoId, valorTotal, tipoAposta='back') {
  // Buscar usuários ativos
  const { data: usuarios, error } = await supabase.from('usuarios').select('*');
  if(error) { console.error(error); return; }

  const saldoTotal = usuarios.reduce((acc, u) => acc + u.saldo, 0);

  // Preparar apostas proporcionais
  let apostas = usuarios.map(u => {
    const valorUsuario = (u.saldo / saldoTotal) * valorTotal;
    return { id: u.id, nome: u.nome, valor: valorUsuario };
  });

  console.log('Apostas proporcionais preparadas:', apostas);

  // Aqui seria a chamada para a API da Pinnacle
  // Ainda sem enviar apostas reais até receber credenciais
  apostas.forEach(async a => {
    console.log(`Preparando aposta para ${a.nome}: R$${a.valor.toFixed(2)} (${tipoAposta})`);
    // Exemplo de chamada futura:
    /*
    const response = await axios.post(`${PINNACLE_API}/bets`, {
      eventId: eventoId,
      stake: a.valor,
      type: tipoAposta
    }, {
      auth: { username: USERNAME, password: PASSWORD }
    });
    console.log(`Aposta de ${a.nome} enviada:`, response.data);
    */
  });
}

/**
 * Função para atualizar saldo dos usuários após resultado da aposta
 * @param {number} resultadoPercentual - % de ganho ou perda (positivo ou negativo)
 */
export async function atualizarSaldo(resultadoPercentual, valorTotal) {
  const { data: usuarios, error } = await supabase.from('usuarios').select('*');
  if(error){ console.error(error); return; }

  const saldoTotal = usuarios.reduce((acc, u) => acc + u.saldo, 0);

  for(let u of usuarios){
    const valorReservado = (u.saldo / saldoTotal) * valorTotal;
    let novoSaldo = u.saldo;

    if(resultadoPercentual > 0){
      novoSaldo += valorReservado * resultadoPercentual * 0.7; // lucro 70%
    } else {
      novoSaldo -= valorReservado * Math.abs(resultadoPercentual); // perda do usuário
    }

    await supabase.from('usuarios').update({ saldo: novoSaldo }).eq('id', u.id);
  }

  console.log('Saldos atualizados após resultado.');
}
