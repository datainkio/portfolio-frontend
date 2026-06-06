#!/usr/bin/env node
/**
 * ---
 * aix:
 *   id: frontend.scripts.install-git-hooks
 *   role: Build/utility script: scripts/install-git-hooks.mjs
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - install-git-hooks.mjs
 * ---
 */

import { execFileSync } from "node:child_process";

function execGit(args, { cwd } = {}) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function tryExecGit(args, { cwd } = {}) {
  try {
    return execGit(args, { cwd });
  } catch {
    return null;
  }
}

async function main() {
  const cwd = process.cwd();
  const root = tryExecGit(["rev-parse", "--show-toplevel"], { cwd });
  if (!root) {
    process.stderr.write("install-git-hooks: not inside a git repo\n");
    process.exit(2);
  }

  const existing = tryExecGit(["config", "--get", "core.hooksPath"], {
    cwd: root,
  });
  if (existing && existing !== ".githooks") {
    process.stderr.write(
      `install-git-hooks: core.hooksPath is set to "${existing}" (expected .githooks).\n` +
        "If you want to override it, run: git config core.hooksPath .githooks\n",
    );
    process.exit(2);
  }

  execGit(["config", "core.hooksPath", ".githooks"], { cwd: root });
  process.stdout.write(
    "install-git-hooks: configured core.hooksPath=.githooks\n",
  );
  process.exit(0);
}

main().catch((err) => {
  process.stderr.write(
    `install-git-hooks failed: ${err?.message || String(err)}\n`,
  );
  process.exit(2);
});
