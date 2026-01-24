async function ativarPacote() {
  const msg = document.getElementById('msgPacote');
  
  // Verifica se já tem pacote ativo
  const { data: pacoteAtivo } = await supabase
    .from('plano_a_mensal')
    .select('*')
    .eq('usuario', usuarioAtual)
    .eq('pago', true)
    .gte('data_fim', new Date().toISOString());

  if (pacoteAtivo.length > 0) {
    msg.innerText = "Você já possui um pacote ativo!";
    msg.style.color = "orange";
    return;
  }

  const hoje = new Date();
  const fim = new Date();
  fim.setDate(hoje.getDate() + 30); // pacote de 30 dias

  const { error } = await supabase
    .from('plano_a_mensal')
    .insert({
      usuario: usuarioAtual,
      email: "EMAIL_DO_USUARIO", // substitua pelo email real
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
    }
