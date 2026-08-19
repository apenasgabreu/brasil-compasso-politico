import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reviewDirectory = path.join(root, "review", "double-coding");

const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), "utf8"));

function parseQuestions(source) {
  const entries = [...source.matchAll(/\{ id: "([^"]+)", axis: "([^"]+)", text: "((?:[^"\\]|\\.)*)"/g)]
    .map((match) => ({ id: match[1], axis: match[2], text: JSON.parse(`"${match[3]}"`) }));
  if (entries.length !== 50) throw new Error(`Esperadas 50 afirmações; encontradas ${entries.length}.`);
  return entries;
}

const candidateName = (program) => program.split(" — ")[0].trim();

const sourceProgramByMatrixProgram = {
  "Romeu Zema — Partido NOVO": "Romeu Zema — NOVO",
  "Partido Democrata — Brasil em Primeiro Lugar": "Wilson Grassi — Democrata",
  "PCO — Programa partidário": "Rui Costa Pimenta — PCO",
  "Ronaldo Caiado e Gilberto Kassab — PSD": "Ronaldo Caiado — PSD",
  "Renan Santos — Partido Missão": "Renan Santos — Partido Missão",
  "Luiz Inácio Lula da Silva — coligação": "Luiz Inácio Lula da Silva — PT",
  "PSTU — Programa partidário": "Hertz Dias — PSTU",
  "Flávio Bolsonaro — PL": "Flávio Bolsonaro — PL",
  "Augusto Cury — partido não declarado": "Augusto Cury — Avante",
  "Edmilson Costa e Cleusa Santos — PCB": "Edmilson Costa e Cleusa Santos — PCB",
  "Clariana Barão — Democracia Cristã — Proteger Hoje, Transformar o Amanhã": "Clariana Barão — Democracia Cristã",
  "Samara Martins — Unidade Popular": "Samara Martins — UP",
};

async function main() {
  const [matrix, documents, integrity, compassSource] = await Promise.all([
    readJson("shared/compassPositions.json"),
    readJson("shared/source-document-integrity.json"),
    readJson("shared/matrix-integrity.json"),
    readFile(path.join(root, "client", "src", "data", "compassData.ts"), "utf8"),
  ]);
  const questions = parseQuestions(compassSource);
  const assignments = matrix.programs.flatMap((program, programIndex) => {
    const sourceProgram = sourceProgramByMatrixProgram[program.program];
    if (!sourceProgram) throw new Error(`Mapeamento de documento ausente para ${program.program}.`);
    const document = documents.documents.find((entry) => entry.program === sourceProgram);
    if (!document) throw new Error(`Documento-fonte não encontrado para ${program.program}.`);
    return questions.map((question, questionIndex) => ({
      caseId: `DC-${String(programIndex + 1).padStart(2, "0")}-${String(questionIndex + 1).padStart(2, "0")}`,
      candidate: program.program,
      statementId: question.id,
      axis: question.axis,
      statement: question.text,
      source: {
        fileName: document.fileName,
        sha256: document.sha256,
        deliveryUrl: document.deliveryUrl,
        archivePackageUrl: documents.archivePackageUrl,
        officialCatalogUrl: documents.officialCatalogUrl,
      },
      reviewer2Position: null,
      reviewer2Confidence: null,
      reviewer2EvidencePage: "",
      reviewer2EvidenceQuote: "",
      reviewer2Notes: "",
      status: "pending",
    }));
  });

  if (assignments.length !== matrix.programs.length * questions.length) throw new Error("A folha cega não contém todas as células da matriz.");
  await mkdir(reviewDirectory, { recursive: true });
  const template = {
    schemaVersion: "1.0",
    matrixVersion: integrity.version,
    matrixFingerprint: integrity.aggregateHash,
    purpose: "Folha cega para segundo codificador. Não contém posição, confiança, citação ou página do primeiro codificador.",
    reviewerInstructions: [
      "Trabalhe somente com o PDF indicado e a escala publicada no codebook.",
      "Registre posição (-2, -1, 0, 1, 2 ou null), confiança (0.8 ou 0.9 quando houver posição), página, citação e nota de interpretação.",
      "Não consulte a matriz, o resultado do questionário, evidências já catalogadas ou a decisão do primeiro codificador antes da entrega.",
      "Mantenha status como complete somente após preencher todas as decisões da linha.",
    ],
    assignments,
  };
  await writeFile(path.join(reviewDirectory, "reviewer-2-blind-template.json"), `${JSON.stringify(template, null, 2)}\n`);
  console.log(`Folha cega criada: ${assignments.length} células em review/double-coding/reviewer-2-blind-template.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
