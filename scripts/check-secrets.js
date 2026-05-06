#!/usr/bin/env node

// =============================================================
//  scripts/check-secrets.js
//  Detecta posibles secretos en los archivos del staging area.
//  Funciona en Linux, Mac y Windows — solo requiere Node.js.
// =============================================================

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ── Colores ANSI (Win10+, Linux, Mac) ──────────────────────
const c = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

const log = {
  info: (msg) => console.log(`${c.cyan}${msg}${c.reset}`),
  success: (msg) => console.log(`${c.green}${msg}${c.reset}`),
  warning: (msg) => console.log(`${c.yellow}${msg}${c.reset}`),
  error: (msg) => console.log(`${c.red}${msg}${c.reset}`),
  detail: (msg) => console.log(`${c.gray}${msg}${c.reset}`),
  file: (msg) => console.log(`${c.white}${msg}${c.reset}`),
};

// ── Palabras clave sospechosas ──────────────────────────────
const SUSPICIOUS_KEYWORDS = [
  "apikey",
  "api_key",
  "secret",
  "token",
  "password",
  "passwd",
  "firebase",
  "pass",
  "client_id",
  "client_secret",
  "bearer",
  "private_key",
  "auth_token",
  "access_token",
  "refresh_token",
  "database_url",
  "connection_string",
  "smtp_pass",
  "smtp_password",
  "jwt_secret",
  "encryption_key",
  "stripe_key",
  "stripe_secret",
  "aws_secret",
  "aws_access_key",
];

// ── Extensiones binarias a ignorar ─────────────────────────
const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".ico",
  ".svg",
  ".webp",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".otf",
  ".pdf",
  ".zip",
  ".tar",
  ".gz",
  ".7z",
  ".rar",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".mp4",
  ".mp3",
  ".wav",
  ".avi",
]);

// ── Archivos a ignorar por patrón de nombre ─────────────────
const IGNORED_FILE_PATTERNS = [
  /\.example$/,
  /\.sample$/,
  /\.template$/,
  /\.env\.example$/,
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/, // lock file de pnpm
  /yarn\.lock$/,
  /check-secrets\.js$/, // este mismo script
];

// ── El valor asignado debe tener al menos 8 caracteres ──────
// Evita falsos positivos en variables sin valor o con valores triviales
const VALUE_PATTERN = /[=:]["']?[a-zA-Z0-9+/\-_]{8,}["']?/;

// ── Patrón de líneas comentadas ─────────────────────────────
const COMMENT_PATTERN = /^\s*(#|\/\/|\/\*|\*|<!--)/;

// ════════════════════════════════════════════════════════════
//  MAIN
// ════════════════════════════════════════════════════════════
async function main() {
  console.log();
  log.info("🔍 Escaneando posibles secretos en los ficheros a commitear...");
  console.log();

  // 1. Archivos en staging
  let stagedFiles;
  try {
    const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf8",
    }).trim();
    stagedFiles = output ? output.split("\n").map((f) => f.trim()) : [];
  } catch {
    log.error("❌ Error al obtener archivos del staging. ¿Estás en un repositorio Git?");
    process.exit(1);
  }

  if (stagedFiles.length === 0) {
    log.detail("ℹ️  No hay ficheros en staging para analizar.");
    process.exit(0);
  }

  // 2. Regex combinada de keywords
  const keywordRegex = new RegExp(SUSPICIOUS_KEYWORDS.join("|"), "i");

  const findings = [];

  // 3. Analizar cada archivo
  for (const file of stagedFiles) {
    const normalizedFile = file.replace(/\\/g, "/");

    if (!fs.existsSync(normalizedFile)) continue;

    const ext = path.extname(normalizedFile).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) continue;

    if (IGNORED_FILE_PATTERNS.some((p) => p.test(normalizedFile))) continue;

    let content;
    try {
      content = fs.readFileSync(normalizedFile, "utf8");
    } catch {
      continue;
    }

    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (COMMENT_PATTERN.test(line)) return;
      if (!keywordRegex.test(line)) return;
      if (!VALUE_PATTERN.test(line)) return;

      findings.push({
        file: normalizedFile,
        line: index + 1,
        content: line.trim().substring(0, 120),
      });
    });
  }

  // 4. Sin hallazgos → todo OK
  if (findings.length === 0) {
    log.success("✅ No se encontraron posibles secretos en los ficheros a commitear.");
    console.log();
    process.exit(0);
  }

  // 5. Mostrar hallazgos
  log.warning("⚠️  ¡ADVERTENCIA! Se detectaron posibles secretos:");
  console.log(c.yellow + "─".repeat(60) + c.reset);

  for (const finding of findings) {
    console.log();
    log.file(`  📄 Archivo  : ${finding.file}`);
    log.detail(`  📍 Línea    : ${finding.line}`);
    log.error(`  🔑 Contenido: ${finding.content}`);
  }

  console.log();
  console.log(c.yellow + "─".repeat(60) + c.reset);
  console.log();
  log.info("💡 Usa variables de entorno (.env.local) en lugar de valores literales.");
  log.info("   Añade los ficheros sensibles a .gitignore si es necesario.");
  console.log();

  log.error("❌ COMMIT BLOQUEADO: Se encontraron posibles secretos.");
  log.detail("   Revisa los archivos señalados y asegúrate de que no contengan datos sensibles.");
  console.log();
  process.exit(1);
}

main().catch((err) => {
  console.error("Error inesperado en check-secrets:", err);
  process.exit(1);
});
