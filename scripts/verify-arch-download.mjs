#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = (process.env.STRAY_DOWNLOAD_BASE_URL ?? "https://linuxtoys-ckuyvpj5.manus.space").replace(/\/$/, "");
const stablePath = "/downloads/stray-linux/arch-x64.pacman";
const sidecarPath = `${stablePath}.sha256`;
const allowNonArch = process.env.ALLOW_NON_ARCH === "1";

async function get(path, options = {}) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${base}${path}`, { redirect: options.redirect ?? "follow" });
      if (!response.ok) throw new Error(`${path} respondeu HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 750));
    }
  }
  throw lastError;
}

const redirect = await fetch(`${base}${stablePath}`, { redirect: "manual" });
if (redirect.status !== 302) throw new Error(`redirect Arch esperado: HTTP 302, recebido ${redirect.status}`);
const location = redirect.headers.get("location") ?? "";
if (!location.includes("Stray-Linux-1.3.0") || !location.endsWith(".pacman")) throw new Error(`destino inesperado: ${location}`);

const artifact = Buffer.from(await (await get(stablePath)).arrayBuffer());
if (artifact.length < 1_000_000) throw new Error(`pacote pequeno demais: ${artifact.length} bytes`);
const sha256 = createHash("sha256").update(artifact).digest("hex");
const sidecar = await (await get(sidecarPath)).text();
const expected = sidecar.match(/\b[a-f0-9]{64}\b/i)?.[0]?.toLowerCase();
if (!expected) throw new Error("sidecar não contém SHA-256 válido");
if (sha256 !== expected) throw new Error(`SHA-256 divergente: calculado ${sha256}, publicado ${expected}`);

const magic = artifact.subarray(0, 4).toString("hex");
const archiveFormat = magic === "1f8b0800" ? "gzip" : magic === "28b52ffd" ? "zstd" : "unknown";
if (archiveFormat === "unknown") throw new Error(`contêiner Arch não reconhecido: magic ${magic}`);

const temp = mkdtempSync(join(tmpdir(), "stray-arch-audit-"));
const packagePath = join(temp, "stray-linux.pacman");
writeFileSync(packagePath, artifact);
try {
  if (archiveFormat === "gzip") {
    const listing = execFileSync("tar", ["-tzf", packagePath], { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
    if (!listing.includes("opt/Stray Linux/")) throw new Error("tar Arch não contém o diretório opt/Stray Linux");
    console.log("Arch package metadata: tar.gz contains opt/Stray Linux/");
  } else if (existsSync("/usr/bin/pacman")) {
    const metadata = execFileSync("pacman", ["-Qp", packagePath], { encoding: "utf8" }).trim();
    if (!metadata.includes("stray-linux")) throw new Error(`pacman identificou pacote inesperado: ${metadata}`);
    console.log(`Arch package metadata: ${metadata}`);
  } else if (!allowNonArch) {
    throw new Error("pacman não encontrado; execute este script em Arch ou use ALLOW_NON_ARCH=1 apenas para validar download e checksum");
  } else {
    console.log("Arch package metadata: skipped (pacman não disponível neste sandbox)");
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log(JSON.stringify({ base, redirect: location, bytes: artifact.length, sha256, sidecar: expected, container: archiveFormat, packageInspection: archiveFormat === "gzip" ? "tar -tzf" : existsSync("/usr/bin/pacman") ? "pacman -Qp" : "skipped-non-arch" }, null, 2));
