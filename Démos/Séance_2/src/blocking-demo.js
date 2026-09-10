import { readFile, writeFile } from "fs/promises";
import { readFileSync } from "fs";
import { setTimeout as pause } from "timers/promises";

// Un battement toutes les 200 ms : c'est notre temoin.
// Tant qu'il s'affiche, le fil d'execution est libre.
let ticks = 0;
const battement = setInterval(() => {
  ticks += 1;
  console.log(`  battement ${ticks}`);
}, 200);

await writeFile("gros-fichier.json", JSON.stringify(Array(400000).fill({ value: 22.4 })));

// --- Phase 1 : version NON bloquante ---------------------------------
console.log("--- Phase 1 : 300 lectures avec await readFile ---");
const debut1 = Date.now();
const avant1 = ticks;

for (let i = 0; i < 300; i += 1) {
  await readFile("gros-fichier.json", "utf-8");
}

console.log(`--- Phase 1 terminee en ${Date.now() - debut1} ms, ${ticks - avant1} battements ---`);

// --- Phase 2 : LA MEME CHOSE, en version bloquante -------------------
console.log("--- Phase 2 : 300 lectures avec readFileSync ---");
const debut2 = Date.now();
const avant2 = ticks;

for (let i = 0; i < 300; i += 1) {
  readFileSync("gros-fichier.json", "utf-8");
}

console.log(`--- Phase 2 terminee en ${Date.now() - debut2} ms, ${ticks - avant2} battements ---`);

clearInterval(battement);