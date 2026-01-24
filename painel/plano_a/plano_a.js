async function ativarPacote() {
  const msg = document.getElementById('msgPacote');
  
  const hoje = new Date();
  const fim = new Date();
  fim.setDate(hoje.getDate() + 30);

  // Verifica se já possui pacote ativo
  const { data: pacoteAtivo } = await supabase
    .from('plano_a_mensal')
    .select('*')
    .eq('usuario', usuarioAtual)
    .eq('pago', true)
    .gte('data_fim', hoje.toISOString());

  if (pacoteAtivo.length > 0) {
    msg.innerText = "Você já possui um pacote ativo!";
    msg.style.color = "orange";
    return;
  }

  const { error } = await supabase
    .from('plano_a_mensal')
    .insert({
      usuario: usuarioAtual,
      email: "EMAIL_DO_USUARIO",
      data_inicio: hoje.toISOString(),
      data_fim: fim.toISOString(),
      pago: true
    });

  if (error) {
    msg.innerText = "Erro ao ativar pacote: " + error.message;
    msg.style.color = "red";
    return;
  }

  msg.innerText = "Pacote ativado com sucesso! Duração: 30 dias";
  msg.style.color = "green";
  carregarAlertas(usuarioAtual);
}

// Verifica pacote antes de exibir alertas
async function verificarPacote(usuario) {
  const hoje = new Date();
  const { data } = await supabase
    .from('plano_a_mensal')
    .select('*')
    .eq('usuario', usuario)
    .eq('pago', true)
    .gte('data_fim', hoje.toISOString());

  if (data.length === 0) {
    document.getElementById('alertas').innerHTML = '<li>Você não possui pacote ativo. Ative para ver alertas!</li>';
  } else {
    carregarAlertas(usuario);
  }
}
