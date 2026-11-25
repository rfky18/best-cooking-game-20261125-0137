// NASGOR RUSH — program penyerahan untuk kontes make.fun best-cooking-game.
//
// Kerja program ini cuma satu: menyerahkan game ke direktori output.
// Game-nya sendiri file statis di game/ (index.html + game.js + style.css,
// tanpa build step, tanpa request jaringan). Screenshot hasil main game
// sendiri ada di screenshots/. Program ini menyalin keduanya ke direktori
// tujuan lalu menulis dossier.json di sana, memakai pustaka vendored dari
// kit (vendor/makefun-game.ts) supaya dossier yang dihasilkan sama persis
// dengan yang ditulis scorer.
//
// Cara jalan di luar grader (di dalam grader, /output dipakai langsung):
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Node 22+, stdlib saja. Tidak ada network, tidak ada jam, tidak ada acak,
// tidak ada baca di luar repo ini — dua run dari repo yang sama selalu
// menghasilkan output yang byte-nya identik.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

// Folder tempat file ini tinggal = root repo.
const repoDir = fileURLToPath(new URL(".", import.meta.url));

// Grader menulis ke /output; di luar grader, variabel lingkungan ini
// menggantikannya.
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Batas-batas yang dipakai scorer (lihat RULES.txt kit): teks dossier
// maksimal 160 KiB; maksimal 4 screenshot @ 256 KiB; game/ maksimal
// 993 file dan 48 MiB, tiap path maksimal 1000 byte. buildDossier
// menolak entri yang melanggar batas-batas itu.
const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function handIn(): void {
  mkdirSync(targetDir, { recursive: true });

  // 1. Salin seluruh game/ apa adanya.
  cpSync(join(repoDir, "game"), join(targetDir, "game"), { recursive: true });

  // 2. Salin seluruh screenshots/ apa adanya (kalau ada).
  const shotsDir = join(repoDir, "screenshots");
  if (existsSync(shotsDir)) {
    cpSync(shotsDir, join(targetDir, "screenshots"), { recursive: true });
  }

  // 3. Tulis dossier.json dari isi direktori tujuan yang baru disalin.
  writeFileSync(join(targetDir, "dossier.json"), buildDossier(targetDir, caps));
}

handIn();
