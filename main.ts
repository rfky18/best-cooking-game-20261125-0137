/**
 * NASGOR RUSH — deterministic entrypoint (Node 22+, TypeScript, no dependencies).
 *
 * No network. No reads outside this repo. No randomness, no clock in the
 * simulation: the same repo always produces the same log.
 *
 * What it does:
 *  1. Validates every file referenced by game/index.html exists under game/.
 *  2. Re-implements the core cooking logic headlessly (same rules as game.js):
 *     recipe multiset matching + undercooked / perfect / burned quality zones.
 *  3. Simulates all 8 recipes at perfect timing and a set of edge cases
 *     (wrong combo, missing ingredient, double egg, overcooked).
 *  4. Writes a JSON run log to /output (or ./out when /output is absent)
 *     and exits 0. Two runs of the same repo produce byte-identical logs.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const gameDir = join(repoRoot, "game");

type Quality = "undercooked" | "perfect" | "burned";
type Check = { name: string; ok: boolean; detail: string };

/* ---- recipe table (mirrors game.js RECIPES) ---- */
const RECIPES: { id: string; needs: string[]; points: number }[] = [
  { id: "original", needs: ["rice", "egg", "garlic", "shallot", "kecap"], points: 100 },
  { id: "pedas", needs: ["rice", "egg", "garlic", "chili", "kecap"], points: 120 },
  { id: "ayam", needs: ["rice", "chicken", "egg", "garlic", "kecap"], points: 140 },
  { id: "seafood", needs: ["rice", "shrimp", "egg", "garlic", "onion"], points: 150 },
  { id: "spesial", needs: ["rice", "chicken", "egg", "chili", "garlic", "kecap"], points: 170 },
  { id: "kampung", needs: ["rice", "egg", "shallot", "garlic", "chili", "salt"], points: 160 },
  { id: "telur", needs: ["rice", "egg", "egg", "garlic", "kecap"], points: 130 },
  { id: "komplit", needs: ["rice", "chicken", "shrimp", "egg", "chili", "garlic", "kecap"], points: 200 },
];

function multisetEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const ca: Record<string, number> = {};
  const cb: Record<string, number> = {};
  for (const x of a) ca[x] = (ca[x] ?? 0) + 1;
  for (const x of b) cb[x] = (cb[x] ?? 0) + 1;
  return Object.keys(ca).every((k) => ca[k] === cb[k]);
}

function matchRecipe(ids: string[]): string | null {
  const hit = RECIPES.find((r) => multisetEqual(ids, r.needs));
  return hit ? hit.id : null;
}

/* perfect zone 45..85 (base, no upgrades) — mirrors game.js qualityOf() */
function qualityOf(progress: number): Quality {
  if (progress < 45) return "undercooked";
  if (progress <= 85) return "perfect";
  return "burned";
}

function scoreFor(recipeId: string, quality: Quality): number {
  const r = RECIPES.find((x) => x.id === recipeId);
  if (!r) return 0;
  if (quality === "perfect") return Math.round(r.points * 1.5);
  if (quality === "undercooked") return Math.round(r.points * 0.5);
  return Math.round(r.points * 0.25);
}

function main(): void {
  const checks: Check[] = [];

  /* 1. file validation: every local asset referenced by index.html must exist */
  const html = readFileSync(join(gameDir, "index.html"), "utf8");
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((r) => !r.startsWith("http") && !r.startsWith("#") && !r.startsWith("data:"));
  for (const ref of refs) {
    const p = join(gameDir, ref);
    checks.push({ name: `asset:${ref}`, ok: existsSync(p), detail: existsSync(p) ? "present" : "MISSING" });
  }
  const gameFiles = readdirSync(gameDir).sort();
  for (const f of ["index.html", "style.css", "game.js"]) {
    checks.push({ name: `file:${f}`, ok: gameFiles.includes(f), detail: gameFiles.includes(f) ? "present" : "MISSING" });
  }

  /* 2. headless simulation: all 8 recipes match at perfect timing */
  const sim: { recipe: string; quality: Quality; score: number }[] = [];
  for (const r of RECIPES) {
    const matched = matchRecipe([...r.needs]);
    const q = qualityOf(65);
    const score = matched ? scoreFor(matched, q) : 0;
    checks.push({ name: `recipe:${r.id}`, ok: matched === r.id && q === "perfect" && score === Math.round(r.points * 1.5), detail: `matched=${matched} quality=${q} score=${score}` });
    sim.push({ recipe: r.id, quality: q, score });
  }

  /* 3. edge cases (deterministic, no clock) */
  const edges: { name: string; ok: boolean; detail: string }[] = [];
  const wrongCombo = matchRecipe(["rice", "egg", "garlic", "chili", "tomato"]);
  edges.push({ name: "edge:wrong-combo-no-match", ok: wrongCombo === null, detail: `matched=${wrongCombo}` });
  const missingOne = matchRecipe(["rice", "egg", "garlic", "shallot"]);
  edges.push({ name: "edge:missing-ingredient-no-match", ok: missingOne === null, detail: `matched=${missingOne}` });
  const oneEgg = matchRecipe(["rice", "egg", "garlic", "kecap"]);
  edges.push({ name: "edge:telur-needs-two-eggs", ok: oneEgg === null, detail: `one-egg matched=${oneEgg}` });
  const twoEggs = matchRecipe(["rice", "egg", "egg", "garlic", "kecap"]);
  edges.push({ name: "edge:telur-two-eggs-match", ok: twoEggs === "telur", detail: `matched=${twoEggs}` });
  const extra = matchRecipe(["rice", "egg", "garlic", "shallot", "kecap", "salt"]);
  edges.push({ name: "edge:extra-ingredient-no-match", ok: extra === null, detail: `matched=${extra}` });
  edges.push({ name: "edge:quality-20-undercooked", ok: qualityOf(20) === "undercooked", detail: qualityOf(20) });
  edges.push({ name: "edge:quality-45-perfect", ok: qualityOf(45) === "perfect", detail: qualityOf(45) });
  edges.push({ name: "edge:quality-85-perfect", ok: qualityOf(85) === "perfect", detail: qualityOf(85) });
  edges.push({ name: "edge:quality-90-burned", ok: qualityOf(90) === "burned", detail: qualityOf(90) });
  edges.push({ name: "edge:quality-100-burned", ok: qualityOf(100) === "burned", detail: qualityOf(100) });
  edges.push({ name: "edge:score-burned-komplit", ok: scoreFor("komplit", "burned") === 50, detail: `${scoreFor("komplit", "burned")}` });
  edges.push({ name: "edge:score-undercooked-original", ok: scoreFor("original", "undercooked") === 50, detail: `${scoreFor("original", "undercooked")}` });
  for (const e of edges) checks.push(e);

  const failed = checks.filter((c) => !c.ok);
  const outDir = existsSync("/output") ? "/output" : join(repoRoot, "out");
  mkdirSync(outDir, { recursive: true });
  const log = {
    program: "nasgor-rush",
    deterministic: true,
    files: gameFiles,
    checks,
    simulation: sim,
    totals: {
      checks: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
      recipesSimulated: sim.length,
      totalPerfectScore: sim.reduce((s, x) => s + x.score, 0),
    },
    result: failed.length === 0 ? "PASS" : "FAIL",
  };
  writeFileSync(join(outDir, "run-log.json"), JSON.stringify(log, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({ result: log.result, checks: log.totals, out: join(outDir, "run-log.json") }));
  if (failed.length > 0) process.exit(1);
}

main();
