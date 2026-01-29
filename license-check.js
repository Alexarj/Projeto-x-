// security/license-check.js
const fs = require("fs");
const path = require("path");

// Configurações de proteção
const allowedDomain = "meudominio.com"; // coloque seu domínio ou servidor autorizado
const licenseKey = "SUA_CHAVE_UNICA_AQUI"; // gere uma chave única por instalação
const logFile = path.join(__dirname, "logs", "unauthorized.log");

// Função para registrar tentativas não autorizadas
function logUnauthorized(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, logMessage, "utf8");
}

// Função de validação
function checkLicense(currentDomain, key) {
    if (currentDomain !== allowedDomain) {
        logUnauthorized(`Domínio não autorizado: ${currentDomain}`);
        console.error("Execução bloqueada: domínio não autorizado!");
        process.exit(1);
    }
    if (key !== licenseKey) {
        logUnauthorized(`Licença inválida: ${key} no domínio ${currentDomain}`);
        console.error("Execução bloqueada: licença inválida!");
        process.exit(1);
    }
    console.log("Licença validada. Projeto X funcionando normalmente.");
}

module.exports = { checkLicense };
