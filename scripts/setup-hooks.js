#!/usr/bin/env node

/**
 * setup-hooks.js
 * Configura git hooks automáticamente después de npm install / pnpm install
 * Se ejecuta mediante el script "prepare" en package.json
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const HOOK_DIR = path.join(__dirname, "..", ".git", "hooks");
const PRE_COMMIT_HOOK = path.join(HOOK_DIR, "pre-commit");
const PRE_COMMIT_BAT = path.join(HOOK_DIR, "pre-commit.bat");

// Contenido del pre-commit hook (compatibile con WSL y Windows)
const HOOK_CONTENT = `#!/bin/bash
# pre-commit hook: ejecuta check-secrets.js antes de cada commit

# Intentar obtener la ruta del repositorio desde git
REPO_ROOT=$(git rev-parse --show-toplevel)
SCRIPT_PATH="$REPO_ROOT/scripts/check-secrets.js"

# Convertir a ruta de Windows si estamos en WSL
if command -v wslpath &> /dev/null; then
  SCRIPT_PATH=$(wslpath -w "$SCRIPT_PATH")
fi

exec node "$SCRIPT_PATH"
`;

// Contenido del pre-commit.bat para Windows
const BAT_CONTENT = `@echo off
REM pre-commit hook: ejecuta check-secrets.js antes de cada commit
setlocal enabledelayedexpansion

cd /d "%~dp0\..\..\"
node scripts\\check-secrets.js
exit /b %errorlevel%
`;

function setupHooks() {
  try {
    // Crear directorio de hooks si no existe
    if (!fs.existsSync(HOOK_DIR)) {
      fs.mkdirSync(HOOK_DIR, { recursive: true });
    }

    // Escribir el pre-commit hook bash
    fs.writeFileSync(PRE_COMMIT_HOOK, HOOK_CONTENT, { mode: 0o755 });

    // Escribir el pre-commit.bat para Windows
    fs.writeFileSync(PRE_COMMIT_BAT, BAT_CONTENT, { mode: 0o755 });

    console.log("✅ Git hooks configurado correctamente");
    console.log(`   📍 Hook bash instalado en: ${PRE_COMMIT_HOOK}`);
    console.log(`   📍 Hook batch instalado en: ${PRE_COMMIT_BAT}`);
    console.log("   🔍 El script check-secrets.js se ejecutará en cada commit");
  } catch (error) {
    console.error("❌ Error configurando git hooks:", error.message);
    process.exit(1);
  }
}

setupHooks();
