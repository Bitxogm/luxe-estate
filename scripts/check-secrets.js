#!/usr/bin/env node

// =============================================================
//  scripts/check-secrets.js
//  Detecta posibles secretos en los archivos del staging area.
//
//  BYPASS OPTIONS:
//  - Por línea:   añade "// nosec" al final de la línea
//  - Global:      ALLOW_SECRETS=1 git commit -m "..."
// =============================================================

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ── Colores ANSI ────────────────────────────────────────────
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

// ── Patrones de secretos reales ─────────────────────────────
//
// Cada patrón requiere que la keyword sea el LHS de una asignación
// (keyword = "valor" o keyword: "valor"), no que aparezca en cualquier
// posición. Evita falsos positivos como id="currentPassword".
//
const SUSPICIOUS_PATTERNS = [
  // Credenciales como clave de asignación: apiKey = "...", secret: "..."
  {
    re: /\b(?:api[_-]?key|secret[_-]?key?|auth[_-]?token|access[_-]?token|refresh[_-]?token|client[_-]?secret|private[_-]?key|jwt[_-]?secret|database[_-]?url|connection[_-]?string|smtp[_-]?pass(?:word)?|encryption[_-]?key|stripe[_-]?(?:secret|key)|aws[_-]?(?:secret|access[_-]?key))\s*[=:]\s*["'][^"']{8,}["']/i,
    label: "Posible credencial hardcodeada (patrón clave=valor)",
  },
  // Password como variable/propiedad asignada a un literal
  // \b evita que "currentPassword", "newPassword" disparen
  {
    re: /\bpass(?:word|wd|phrase)?\s*[=:]\s*["'][^"']{4,}["']/i,
    label: "Posible password hardcodeada",
  },
  // Variables de entorno con valor hardcodeado en código fuente
  {
    re: /\b(?:PASSWORD|API_KEY|SECRET|TOKEN|DATABASE_URL|JWT_SECRET)\s*=\s*["'][^"']{8,}["']/,
    label: "Variable de entorno con valor literal en código",
  },
  // Tokens con prefijos conocidos
  { re: /sk_live_[a-zA-Z0-9]{20,}/, label: "Stripe secret key (sk_live_)" },
  { re: /pk_live_[a-zA-Z0-9]{20,}/, label: "Stripe public key en producción (pk_live_)" },
  { re: /AIza[a-zA-Z0-9\-_]{35}/, label: "Google API key (AIza...)" },
  { re: /ghp_[a-zA-Z0-9]{36,}/, label: "GitHub personal access token (ghp_)" },
  { re: /ghs_[a-zA-Z0-9]{36,}/, label: "GitHub service token (ghs_)" },
  { re: /xoxb-[0-9]+-[a-zA-Z0-9\-]+/, label: "Slack bot token (xoxb-)" },
  { re: /xoxp-[0-9]+-[a-zA-Z0-9\-]+/, label: "Slack user token (xoxp-)" },
  { re: /AKIA[0-9A-Z]{16}/, label: "AWS Access Key ID (AKIA...)" },
  { re: /ey[a-zA-Z0-9\-_]{20,}\.ey[a-zA-Z0-9\-_]{20,}/, label: "JWT token hardcodeado" },
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

// ── Archivos a ignorar ──────────────────────────────────────
const IGNORED_FILE_PATTERNS = [
  /\.example$/,
  /\.sample$/,
  /\.template$/,
  /\.env\.example$/,
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/,
  /yarn\.lock$/,
  /check-secrets\.js$/,
];

// ── Líneas a ignorar siempre ────────────────────────────────
const IGNORED_LINE_PATTERNS = [
  /^\s*(?:#|\/\/|\/\*|\*|<!--)/, // comentarios
  /\bnosec\b/, // marca explícita de bypass por línea
  /import\s+.*from\s+["']/, // import statements
  /placeholder=["'][^"']*["']/, // atributos placeholder HTML
  /process\.env\./, // referencias a env vars (no valores)
];

// ── Prompt interactivo via /dev/tty ─────────────────────────
function askToContinue() {
  return new Promise((resolve) => {
    let tty;
    try {
      tty = fs.createReadStream("/dev/tty");
    } catch {
      resolve(false);
      return;
    }

    const rl = readline.createInterface({ input: tty, output: process.stdout });
    process.stdout.write(
      `\n${c.yellow}¿Continuar con el commit de todas formas? (s/N): ${c.reset}`
    );
    rl.once("line", (answer) => {
      rl.close();
      tty.destroy();
      resolve(answer.trim().toLowerCase() === "s");
    });
    rl.once("close", () => resolve(false));
  });
}

// ════════════════════════════════════════════════════════════
//  MAIN
// ════════════════════════════════════════════════════════════
async function main() {
  // Bypass global via env var
  if (process.env.ALLOW_SECRETS === "1") {
    log.warning("⚠️  ALLOW_SECRETS=1 — verificación de secretos omitida.");
    process.exit(0);
  }

  console.log();
  log.info("🔍 Escaneando posibles secretos en los ficheros a commitear...");
  console.log();

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

  const findings = [];

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
      if (IGNORED_LINE_PATTERNS.some((p) => p.test(line))) return;

      const match = SUSPICIOUS_PATTERNS.find(({ re }) => re.test(line));
      if (!match) return;

      findings.push({
        file: normalizedFile,
        line: index + 1,
        content: line.trim().substring(0, 120),
        label: match.label,
      });
    });
  }

  if (findings.length === 0) {
    log.success("✅ No se encontraron posibles secretos en los ficheros a commitear.");
    console.log();
    process.exit(0);
  }

  // Mostrar hallazgos
  log.warning("⚠️  ¡ADVERTENCIA! Se detectaron posibles secretos:");
  console.log(c.yellow + "─".repeat(60) + c.reset);

  for (const finding of findings) {
    console.log();
    log.file(`  📄 Archivo  : ${finding.file}`);
    log.detail(`  📍 Línea    : ${finding.line}`);
    log.warning(`  ⚠️  Tipo     : ${finding.label}`);
    log.error(`  🔑 Contenido: ${finding.content}`);
  }

  console.log();
  console.log(c.yellow + "─".repeat(60) + c.reset);
  console.log();
  log.info("💡 Opciones:");
  log.info("   · Usa variables de entorno (.env.local) en lugar de valores literales.");
  log.info("   · Añade '// nosec' al final de la línea para ignorarla explícitamente.");
  log.info("   · Usa ALLOW_SECRETS=1 git commit -m '...' para saltar toda la verificación.");
  console.log();

  // Prompt interactivo
  const continuar = await askToContinue();
  console.log();

  if (continuar) {
    log.warning("⚠️  Commit permitido por decisión manual. Revisa que no haya secretos reales.");
    console.log();
    process.exit(0);
  }

  log.error("❌ COMMIT BLOQUEADO. Corrige los problemas o usa una de las opciones indicadas.");
  console.log();
  process.exit(1);
}

main().catch((err) => {
  console.error("Error inesperado en check-secrets:", err);
  process.exit(1);
});
