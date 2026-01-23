async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Erro ao sair");
    return;
  }

  window.location.href = "auth/login.html";
}
