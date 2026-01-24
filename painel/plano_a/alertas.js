async function carregarAlertas(usuario) {
  const hoje = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('alertas_diarios')
    .select('*')
    .eq('usuario', usuario)
    .eq('data', hoje);

  const lista = document.getElementById('alertas');
  lista.innerHTML = '';

  if (error) {
    lista.innerHTML = '<li>Erro ao carregar alertas</li>';
    return;
  }

  if (data.length === 0) {
    lista.innerHTML = '<li>Sem alertas hoje</li>';
  }

  data.forEach(a => {
    const li = document.createElement('li');
    li.textContent = a.alerta;
    lista.appendChild(li);
  });
}

async function criarAlerta() {
  const msgDiv = document.getElementById('msg');
  const alertaInput = document.getElementById('novo_alerta');
  const texto = alertaInput.value.trim();

  if (!texto) {
    msgDiv.innerText = "Digite um alerta!";
    msgDiv.style.color = "red";
    return;
  }

  const hoje = new Date().toISOString().split('T')[0];

  // Contar alertas do dia
  const { data: alertasHoje } = await supabase
    .from('alertas_diarios')
    .select('*')
    .eq('data', hoje);

  if (alertasHoje.length >= 3) {
    msgDiv.innerText = "Limite de 3 alertas por dia já atingido!";
    msgDiv.style.color = "red";
    return;
  }

  const { error } = await supabase
    .from('alertas_diarios')
    .insert({ usuario: usuarioAtual, alerta: texto, data: hoje });

  if (error) {
    msgDiv.innerText = "Erro ao enviar alerta: " + error.message;
    msgDiv.style.color = "red";
    return;
  }

  alertaInput.value = "";
  msgDiv.innerText = "Alerta enviado!";
  msgDiv.style.color = "green";

  carregarAlertas(usuarioAtual);
}
