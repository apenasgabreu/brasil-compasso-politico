import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const positions = [-2, -1, 0, 1, 2];
const validPosition = (value) => value === null || positions.includes(value);
const validConfidence = (value) => value === null || value === 0.8 || value === 0.9;

function cohenKappa(binaryPairs) {
  if (!binaryPairs.length) return null;
  const observed = binaryPairs.filter(([left, right]) => left === right).length / binaryPairs.length;
  const leftPresent = binaryPairs.filter(([left]) => left).length / binaryPairs.length;
  const rightPresent = binaryPairs.filter(([, right]) => right).length / binaryPairs.length;
  const expected = leftPresent * rightPresent + (1 - leftPresent) * (1 - rightPresent);
  return expected === 1 ? (observed === 1 ? 1 : null) : (observed - expected) / (1 - expected);
}

function ordinalAlpha(pairs) {
  if (pairs.length < 2) return null;
  const distance = (left, right) => ((left - right) / 4) ** 2;
  const observed = pairs.reduce((sum, [left, right]) => sum + distance(left, right), 0) / pairs.length;
  const all = pairs.flat();
  const expected = all.reduce((sum, left, index) => sum + all.reduce((inner, right, rightIndex) => inner + (index === rightIndex ? 0 : distance(left, right)), 0), 0) / (all.length * (all.length - 1));
  return expected === 0 ? (observed === 0 ? 1 : null) : 1 - observed / expected;
}

export function calculateDoubleCodingAgreement(rows) {
  const presencePairs = rows.map((row) => [row.originalPosition !== null, row.reviewer2Position !== null]);
  const positionedPairs = rows.filter((row) => row.originalPosition !== null && row.reviewer2Position !== null)
    .map((row) => [row.originalPosition, row.reviewer2Position]);
  const disagreements = rows.filter((row) => row.originalPosition !== row.reviewer2Position || row.originalConfidence !== row.reviewer2Confidence)
    .map((row) => row.caseId);
  return {
    reviewedCells: rows.length,
    positionPresenceAgreement: presencePairs.filter(([left, right]) => left === right).length / rows.length,
    positionPresenceCohensKappa: cohenKappa(presencePairs),
    jointlyPositionedCells: positionedPairs.length,
    exactPositionAgreementAmongJointlyPositioned: positionedPairs.length ? positionedPairs.filter(([left, right]) => left === right).length / positionedPairs.length : null,
    ordinalKrippendorffAlphaAmongJointlyPositioned: ordinalAlpha(positionedPairs),
    cellsRequiringReconciliation: disagreements,
  };
}

async function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] ?? path.join(root, "review", "double-coding", "agreement-report.json");
  if (!inputPath) throw new Error("Uso: pnpm review:analyze <resposta-do-segundo-codificador.json> [saida.json]");
  const [template, matrix, response] = await Promise.all([
    JSON.parse(await readFile(path.join(root, "review", "double-coding", "reviewer-2-blind-template.json"), "utf8")),
    JSON.parse(await readFile(path.join(root, "shared", "compassPositions.json"), "utf8")),
    JSON.parse(await readFile(inputPath, "utf8")),
  ]);
  const responseByCase = new Map(response.assignments.map((entry) => [entry.caseId, entry]));
  if (responseByCase.size !== template.assignments.length) throw new Error("A resposta deve conter exatamente todas as células da folha cega.");
  const original = new Map(matrix.programs.flatMap((program) => Object.entries(program.positions).map(([statementId, originalPosition]) => [`${program.program}::${statementId}`, { originalPosition, originalConfidence: program.confidences?.[statementId] ?? null }])));
  const rows = template.assignments.map((assignment) => {
    const review = responseByCase.get(assignment.caseId);
    if (!review || !validPosition(review.reviewer2Position) || !validConfidence(review.reviewer2Confidence)) throw new Error(`Resposta inválida em ${assignment.caseId}.`);
    const first = original.get(`${assignment.candidate}::${assignment.statementId}`);
    if (!first) throw new Error(`Célula original não encontrada: ${assignment.caseId}.`);
    return { caseId: assignment.caseId, ...first, reviewer2Position: review.reviewer2Position, reviewer2Confidence: review.reviewer2Confidence };
  });
  const report = {
    schemaVersion: "1.0",
    matrixVersion: template.matrixVersion,
    reviewerId: response.reviewerId ?? "não informado",
    reviewedAt: response.reviewedAt ?? "não informado",
    ...calculateDoubleCodingAgreement(rows),
    note: "O alfa ordinal considera somente células em que ambos codificadores encontraram posição documental. A decisão sobre presença/ausência é reportada separadamente por acordo e kappa de Cohen. Não publique métricas antes de confirmar independência do segundo codificador e concluir a reconciliação.",
  };
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Relatório de concordância criado: ${outputPath}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
