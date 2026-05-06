#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const gitDirectory = path.join(projectRoot, ".git");
const huskyBin = path.join(projectRoot, "node_modules", "husky", "bin.js");
const allowedBranches = new Set(["main", "dev"]);
const requestedBranch = (process.env.PREPARE_GIT_BRANCH || "main").toLowerCase();
const targetBranch = allowedBranches.has(requestedBranch) ? requestedBranch : "main";

const configuredSteps = [];
const warnings = [];

function run(command, args, label, options = {}) {
  const { captureOutput = false } = options;
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: captureOutput ? "pipe" : "inherit",
    env: process.env,
    encoding: "utf8",
  });

  if (result.error) {
    console.warn(`[prepare] No se pudo ejecutar ${label}: ${result.error.message}`);
    return { ok: false, stdout: "", stderr: result.error.message };
  }

  return {
    ok: result.status === 0,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

function printSummary() {
  console.log("[prepare] ✅ Todo ha ido bien.");
  console.log("[prepare] Configuraciones realizadas:");

  if (configuredSteps.length === 0) {
    console.log("  - Sin cambios necesarios.");
  } else {
    configuredSteps.forEach((step) => {
      console.log(`  - ${step}`);
    });
  }

  if (warnings.length > 0) {
    console.log("[prepare] Avisos:");
    warnings.forEach((warning) => {
      console.log(`  - ${warning}`);
    });
  }
}

let repositoryInitializedNow = false;

if (!fs.existsSync(gitDirectory)) {
  console.log("[prepare] No existe .git, inicializando repositorio...");
  const initialized = run("git", ["init"], "git init");

  if (!initialized.ok) {
    console.warn("[prepare] No se pudo inicializar git. Se omite instalación de hooks.");
    warnings.push("No fue posible inicializar Git automáticamente.");
    printSummary();
    process.exit(0);
  }

  repositoryInitializedNow = true;
  configuredSteps.push("Repositorio Git inicializado automáticamente.");
}

if (repositoryInitializedNow) {
  const renamed = run("git", ["branch", "-m", targetBranch], `git branch -m ${targetBranch}`);

  if (renamed.ok) {
    configuredSteps.push(`Rama inicial configurada en '${targetBranch}'.`);
  } else {
    warnings.push(`No se pudo cambiar la rama inicial a '${targetBranch}'.`);
  }
}

if (!fs.existsSync(huskyBin)) {
  console.warn("[prepare] Husky no está disponible todavía. Se omite instalación de hooks.");
  warnings.push("Husky no está disponible todavía; hooks no instalados en este paso.");
  printSummary();
  process.exit(0);
}

const huskyInstalled = run(process.execPath, [huskyBin], "husky");

if (!huskyInstalled.ok) {
  console.warn("[prepare] Husky no pudo configurarse en este paso.");
  warnings.push("Husky no pudo configurarse automáticamente en este paso.");
} else {
  configuredSteps.push("Hooks de Husky instalados.");
}

const hooksPath = run(
  "git",
  ["config", "--local", "--get", "core.hooksPath"],
  "git config core.hooksPath",
  {
    captureOutput: true,
  }
);

if (hooksPath.ok && hooksPath.stdout.trim()) {
  configuredSteps.push(`core.hooksPath = ${hooksPath.stdout.trim()}`);
}

if (!allowedBranches.has(requestedBranch)) {
  warnings.push(`PREPARE_GIT_BRANCH='${requestedBranch}' no es válido. Se usó 'main'.`);
}

printSummary();
