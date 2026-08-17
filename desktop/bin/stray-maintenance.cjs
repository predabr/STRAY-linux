"use strict";

const fs = require("node:fs");
const { spawnSync } = require("node:child_process");

function readText(file) { try { return fs.readFileSync(file, "utf8"); } catch { return null; } }
function command(command, args) {
  try {
    const result = spawnSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 12_000, maxBuffer: 768 * 1024 });
    return { available: !result.error, code: typeof result.status === "number" ? result.status : null, output: String(result.stdout || "").trim(), error: String(result.stderr || "").trim() };
  } catch (error) { return { available: false, code: null, output: "", error: error instanceof Error ? error.message : "Falha ao iniciar comando." }; }
}
function has(commandName) { return command("sh", ["-lc", `command -v ${commandName}`]).available; }
function osId() { const value = readText("/etc/os-release") || ""; return ((value.match(/^ID=(.+)$/m) || [])[1] || "").replace(/^['"]|['"]$/g, "").toLowerCase(); }
function lineItems(result, matcher) { return result.output.split("\n").map((line) => line.trim()).filter(Boolean).flatMap((line) => matcher(line) ? [line] : []); }
function cacheSize(path) { const result = command("du", ["-sk", path]); const kb = Number.parseInt(result.output.split(/\s+/)[0] || "", 10); return Number.isFinite(kb) ? Math.round(kb / 1024) : null; }

function archPreview() {
  const orphans = command("pacman", ["-Qdtq"]);
  const foreign = command("pacman", ["-Qm"]);
  return { family: "arch", manager: "pacman", categories: [
    { id: "orphans", label: "Dependências órfãs", items: lineItems(orphans, () => true), command: "pacman -Qdt", note: "Apenas leitura. Pacotes opcionais podem aparecer; revise antes de remover." },
    { id: "foreign", label: "Pacotes externos", items: lineItems(foreign, () => true), command: "pacman -Qm", note: "Inventário de pacotes fora dos repositórios sincronizados; não são removidos pelo Stray." },
    { id: "cache", label: "Cache de pacotes", items: [], sizeMb: cacheSize("/var/cache/pacman/pkg"), command: "du -sk /var/cache/pacman/pkg", note: "Tamanho observado. O Stray não limpa cache automaticamente." },
  ] };
}

function aptPreview() {
  const simulation = command("apt-get", ["--simulate", "autoremove"]);
  const removable = lineItems(simulation, (line) => /^Remv\s+/i.test(line)).map((line) => line.replace(/^Remv\s+/i, ""));
  return { family: "debian", manager: "apt", categories: [
    { id: "autoremove", label: "Autoremove proposto", items: removable, command: "apt-get --simulate autoremove", note: "Simulação sem alteração. Revise a transação proposta pelo APT antes de confirmar qualquer remoção." },
    { id: "duplicates", label: "Pacotes duplicados", items: [], command: "dpkg-query -W", note: "O dpkg mantém uma versão instalada por pacote; esta leitura não classifica pacotes de arquitetura distinta como duplicados." },
    { id: "cache", label: "Cache de pacotes", items: [], sizeMb: cacheSize("/var/cache/apt/archives"), command: "du -sk /var/cache/apt/archives", note: "Tamanho observado. O Stray não limpa cache automaticamente." },
  ] };
}

function dnfPreview() {
  const simulation = command("dnf", ["--assumeno", "autoremove"]);
  const duplicateCheck = command("dnf", ["check", "--duplicates"]);
  return { family: "rpm", manager: "dnf", categories: [
    { id: "autoremove", label: "Autoremove proposto", items: lineItems(simulation, (line) => /^\s*(Removing|Remove)\s*:/i.test(line)), command: "dnf --assumeno autoremove", note: "Prévia sem confirmação de transação. Uma resolução pode depender do cache e repositórios configurados." },
    { id: "duplicates", label: "Verificação de duplicados", items: lineItems(duplicateCheck, () => true).slice(0, 48), command: "dnf check --duplicates", note: "Resultado de validação do banco local; uma mensagem vazia não equivale a garantia de integridade." },
    { id: "cache", label: "Cache de pacotes", items: [], sizeMb: cacheSize("/var/cache/dnf"), command: "du -sk /var/cache/dnf", note: "Tamanho observado. O Stray não limpa cache automaticamente." },
  ] };
}

function previewMaintenance() {
  const id = osId();
  const result = has("pacman") ? archPreview() : has("apt-get") ? aptPreview() : has("dnf") ? dnfPreview() : { family: id || "unknown", manager: null, categories: [] };
  return { ...result, generatedAt: new Date().toISOString(), privilege: { elevated: typeof process.getuid === "function" ? process.getuid() === 0 : false, cleanupRequiresConfirmation: true }, warning: "Esta tela só coleta uma prévia local. Nenhum pacote, cache, configuração ou permissão foi alterado." };
}

module.exports = { previewMaintenance };
