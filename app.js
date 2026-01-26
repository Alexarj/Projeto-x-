/**
 * ┌─────────────────────────────────────────────┐
 * │           PROJETO X – USO RESTRITO           │
 * ├─────────────────────────────────────────────┤
 * │ Este software é protegido por direitos      │
 * │ autorais e uso NÃO AUTORIZADO é proibido.   │
 * │                                             │
 * │ ✔ Uso permitido apenas para licença válida  │
 * │ ✖ Proibido copiar, clonar, revender ou      │
 * │   redistribuir sem autorização expressa.    │
 * │                                             │
 * │ Monitoramento ativo de uso e acesso.        │
 * │ Violações resultam em bloqueio automático.  │
 * └─────────────────────────────────────────────┘
 */

import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";

/* ===============================
   CONFIGURAÇÕES DE SEGURANÇA
================================ */

const PROJECT_NAME = "Projeto-X";
const LICENSE_SERVER = "https://SEU-SERVIDOR.com/licenca"; // troque depois
const REQUIRED_ENV_FLAG = "AUTHORIZED";

/* ===============================
   PROTEÇÃO DE AMBIENTE
================================ */

function environmentGuard() {
  if (process.env.PROJECT_X_LICENSE !== REQUIRED_ENV_FLAG) {
    console.error("⛔ Uso não autorizado do Projeto X.");
    process.exit(1);
  }

  // Armadilha silenciosa
  if (!process.env.PROJECT_X_KEY) {
    setTimeout(() => {
      console.error("Erro interno.");
      process.exit(1);
    }, 45000);
  }
}

/* ===============================
   VALIDAÇÃO DE LICENÇA EXTERNA
================================ */

async function validateLicense() {
  try {
    const machineId = crypto
      .createHash("sha256")
      .update(process.env.HOSTNAME || "unknown")
      .digest("hex");

    const response = await fetch(LICENSE_SERVER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: PROJECT_NAME,
        license_key: process.env.PROJECT_X_KEY,
        machine: machineId
      })
    });

    const data = await response.json();

    if (!data.authorized) {
      console.error("🚫 Licença inválida, expirada ou bloqueada.");
      process.exit(1);
    }

  } catch (err) {
    console.error("❌ Falha na validação de licença.");
    process.exit(1);
  }
}

/* ===============================
   AVISO DE EXECUÇÃO
================================ */

function showRuntimeWarning() {
  console.log(`
⚠️  PROJETO X – USO LICENCIADO
Este sistema é monitorado.
Uso não autorizado resultará em bloqueio.
`);
}

/* ===============================
   INICIALIZAÇÃO SEGURA
================================ */

await (async () => {
  environmentGuard();
  await validateLicense();
  showRuntimeWarning();
})();

/* ===============================
   APLICAÇÃO PRINCIPAL
================================ */

const app = express();
app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    project: PROJECT_NAME,
    message: "Projeto X autorizado e em execução"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ${PROJECT_NAME} rodando com proteção ativa na porta ${PORT}`);
});
