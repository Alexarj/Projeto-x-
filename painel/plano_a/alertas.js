async function carregarAlertas(usuario) {
  const hoje = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('alertas_diarios')
    .select('*')
    .eq('usuario', usuario)
    .eq('data', hoje);

  const lista = document.getElementById('alertas');
  lista.innerHTML = '';

  if (error) { lista.innerHTML = '<li>Erro ao carregar alertas</li>'; return; }
  if (data.length === 0) { lista.innerHTML = '<li>Sem alertas hoje</li>'; return; }

  data.forEach((a, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>⚡ ALERTA PRÉ-INÍCIO DE PARTIDA #${index + 1}</strong><br>
      <strong>Jogo:</strong> ${a.jogo}<br>
      <strong>Horário de início:</strong> ${a.horario_inicio}<br>
      <strong>Oportunidade:</strong> ${a.oportunidade}<br>
      <strong>Odd:</strong> ${a.odd}<br>
      <span class="alert-risco">⚠️ Aviso: ${a.aviso_risco}</span>
    `;
    lista.appendChild(li);
  });
}

async function criarAlerta() {
  const msgDiv = document.getElementById('msgAlerta');

  const jogo = document.getElementById('jogo').value.trim();
  const horario_inicio = document.getElementById('horario_inicio').value;
  const oportunidade = document.getElementById('oportunidade').value.trim();
  const odd = document.getElementById('odd').value.trim();
  const aviso_risco = document.getElementById('aviso_risco').value.trim();

  if (!jogo || !horario_inicio || !oportunidade || !odd || !aviso_risco) {
    msgDiv.innerText = "Preencha todos os campos!";
    msgDiv.style.color = "red";
    return;
  }

  const hoje = new Date().toISOString().split('T')[0];

  const { data: alertasHoje } = await supabase
    .from('alertas_diarios')
    .select('*')
    .eq('usuario', usuarioAtual)
    .eq('data', hoje);

  if (alertasHoje.length >= 3) {
    msgDiv.innerText = "Limite de 3 alertas por dia já atingido!";
    msgDiv.style.color = "red";
    return;
  }

  const { error } = await supabase
    .from('alertas_diarios')
    .insert({
      usuario: usuarioAtual,
      data: hoje,
      jogo,
      horario_inicio,
      oportunidade,
      odd,
      aviso_risco
    });

  if (error) {
    msgDiv.innerText = "Erro ao enviar alerta: " + error.message;
    msgDiv.style.color = "red";
    return;
  }

  msgDiv.innerText = "Alerta enviado com sucesso!";
  msgDiv.style.color = "green";

  // Limpar campos
  document.getElementById('jogo').value = '';
  document.getElementById('horario_inicio').value = '';
  document.getElementById('oportunidade').value = '';
  document.getElementById('odd').value = '';
  document.getElementById('aviso_risco').value = '';

  carregarAlertas(usuarioAtual);
                                              }
