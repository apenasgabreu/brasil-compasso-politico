import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const manifestPath = new URL("../shared/matrix-integrity.json", import.meta.url);
const trackedFiles = [
  "client/src/data/compassData.ts",
  "client/src/lib/scoring.ts",
  "shared/compassPositions.json",
  "shared/methodology-changelog.json",
  "shared/source-document-integrity.json",
  "shared/candidate-registry-2026.json",
];

const sha256 = (input) => createHash("sha256").update(input).digest("hex");
const files = {};
for (const file of trackedFiles) {
  files[file] = sha256(await readFile(new URL(`../${file}`, import.meta.url)));
}

const canonical = Object.entries(files)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([file, hash]) => `${file}=${hash}`)
  .join("\n");
const current = JSON.parse(await readFile(manifestPath, "utf8"));
const manifest = {
  version: process.env.MATRIX_VERSION ?? current.version,
  algorithm: "weighted-documented-affinity-v1",
  fingerprint: sha256(`${canonical}\n`),
  files,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Manifesto atualizado: ${manifest.version} · ${manifest.fingerprint.slice(0, 16)}`);
