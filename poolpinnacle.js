// poolPinnacle.js
import { supabase } from './supabaseConfig.js';
import axios from 'axios'; // se usar Node.js, no front-end pode usar fetch

// Configurações da Pinnacle (preencher quando receber do suporte)
const PINNACLE_API = 'https://api.pinnacle.com/v2/';
let USERNAME = ''; // receber do suporte
let PASSWORD = ''; // receber do suporte

/**
 * Função para preparar aposta proporcional do pool
 * @param {string} eventoId - ID do evento a apostar
 * @param {number} valorTotal - Valor total que o trader deseja apostar
 * @param {'back'|'lay'} tipoAposta - Tipo de aposta (back ou lay)
 */
export async function apostarEvento(eventoId, valorTotal, tipoAposta = 'back') {
  try {
    // Buscar usuários ativos
    const { data: usuarios, error } = await supabase.from('usuarios').select('*');
    if (error || !usuarios) {
      console.error('Erro ao buscar usuários:', error);
      return;
    }

    const saldoTotal = usuarios.reduce((acc, u) => acc + u.saldo, 0);

    // Preparar apostas proporcionais
    const apostas = usuarios.map(u => {
      const valorUsuario = (u.saldo / saldoTotal) * valorTotal;
      return { id: u.id, nome: u.nome, valor: valorUsuario };
    });

    console.log('Apostas proporcionais preparadas:', apostas);

    // Aqui seria a chamada para a API da Pinnacle
    // A aposta real só é enviada após receber credenciais do suporte
    apostas.forEach(async a => {
      console.log(`Preparando aposta para ${a.nome}: R$${a.valor.toFixed(2)} (${tipoAposta})`);
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

    return apostas; // Retorna apostas preparadas para integração futura
  } catch (err) {
    console.error('Erro em apostarEvento:', err);
  }
}

/**
 * Função para atualizar saldo dos usuários após resultado da aposta
 * @param {number} resultadoPercentual - % de ganho ou perda (positivo ou negativo, ex: 0.2 = +20%)
 * @param {number} valorTotal - Valor total da aposta do pool
 */
export async function atualizarSaldo(resultadoPercentual, valorTotal) {
  try {
    const { data: usuarios, error } = await supabase.from('usuarios').select('*');
    if (error || !usuarios) { console.error(error); return; }

    const saldoTotal = usuarios.reduce((acc, u) => acc + u.saldo, 0);

    for (let u of usuarios) {
      const valorReservado = (u.saldo / saldoTotal) * valorTotal;
      let novoSaldo = u.saldo;

      if (resultadoPercentual > 0) {
        // Lucro: 70% usuário, 30% trader
        novoSaldo += valorReservado * resultadoPercentual * 0.7;
      } else {
        // Perda: apenas usuário perde proporcionalmente
        novoSaldo -= valorReservado * Math.abs(resultadoPercentual);
      }

      await supabase.from('usuarios').update({ saldo: novoSaldo }).eq('id', u.id);
    }

    console.log('Saldos atualizados após resultado da aposta.');
  } catch (err) {
    console.error('Erro em atualizarSaldo:', err);
  }
}

/**
 * Função auxiliar para exibir apostas preparadas (para debug ou front-end)
 * @param {Array} apostas - lista de apostas proporcionais
 */
export function mostrarApostas(apostas) {
  console.table(apostas.map(a => ({
    Usuário: a.nome,
    Valor: a.valor.toFixed(2)
  })));
                                 }
