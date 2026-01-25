// userPool.js
import { getPool, reservarPool } from './poolSupabase.js';

let poolOperando = false; // true quando trader estiver operando
export let poolUsuarios = [
  { nome: "João", valor: 100 },
  { nome: "Maria", valor: 150 }
];

const poolBalanceEl = document.getElementById("poolBalance");
const poolUsersEl = document.getElementById("poolUsers");

// Atualiza visual do pool
export function atualizarPool(){
  const saldoTotal = poolUsuarios.reduce((sum,u)=>sum+u.valor,0);
  poolBalanceEl.innerText = `R$${saldoTotal}`;
  poolUsersEl.innerHTML = "";
  poolUsuarios.forEach(u=>{
    poolUsersEl.innerHTML += `<li>${u.nome}: R$${u.valor}</li>`;
  });
}

// Transferir usuário para pool
export function transferirParaPool(usuario, valor){
  if(valor < 20){
    alert("O valor mínimo para transferir ao pool é R$20");
    return;
  }

  let uIndex = poolUsuarios.findIndex(u => u.nome === usuario);
  if(uIndex === -1){
    poolUsuarios.push({ nome: usuario, valor: valor });
  } else {
    poolUsuarios[uIndex].valor += valor;
  }

  alert(`R$${valor} transferidos para o pool com sucesso!`);
  atualizarPool();
}

// Retirada do pool
export function saqueDoPool(usuario, valor){
  if(poolOperando){
    alert("Não é possível sacar enquanto há operação ativa no pool.");
    return;
  }

  if(valor < 20){
    alert("O valor mínimo para saque é R$20");
    return;
  }

  let uIndex = poolUsuarios.findIndex(u => u.nome === usuario);
  if(uIndex === -1){
    alert("Usuário não encontrado no pool.");
    return;
  }

  if(poolUsuarios[uIndex].valor < valor){
    alert("Saldo insuficiente para saque.");
    return;
  }

  poolUsuarios[uIndex].valor -= valor;
  alert(`Saque de R$${valor} realizado com sucesso!`);
  atualizarPool();
}

// Função para definir quando trader está operando
export function setPoolOperando(valor){
  poolOperando = valor;
}
