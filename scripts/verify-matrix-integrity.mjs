import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../shared/matrix-integrity.json", import.meta.url), "utf8"));
const trackedFiles = [
  "client/src/data/compassData.ts",
  "client/src/lib/scoring.ts",
  "shared/compassPositions.json",
  "shared/methodology-changelog.json",
  "shared/source-document-integrity.json",
  "shared/candidate-registry-2026.json",
];
const sha256 = (input) => createHash("sha256").update(input).digest("hex");
const manifestFiles = Object.keys(manifest.files).sort();

if (JSON.stringify(manifestFiles) !== JSON.stringify([...trackedFiles].sort())) {
  throw new Error("O manifesto deve listar exatamente os arquivos metodológicos protegidos.");
}

const actual = {};
for (const file of trackedFiles) {
  actual[file] = sha256(await readFile(new URL(`../${file}`, import.meta.url)));
  if (actual[file] !== manifest.files[file]) {
    throw new Error(`Integridade divergente em ${file}. Atualize o manifesto somente com revisão metodológica documentada.`);
  }
}

const canonical = Object.entries(actual)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([file, hash]) => `${file}=${hash}`)
  .join("\n");
const fingerprint = sha256(`${canonical}\n`);
if (fingerprint !== manifest.fingerprint) {
  throw new Error("A impressão digital pública da matriz não corresponde aos arquivos protegidos.");
}

console.log(`Integridade confirmada: ${manifest.version} · ${fingerprint.slice(0, 16)}`);
