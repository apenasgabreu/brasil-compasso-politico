import type { ProgramScore } from "@/lib/scoring";
import { deterministicNarrative } from "@/lib/scoring";
import { getProgramMeta, questions, type Answer, type Position } from "@/data/compassData";

let enginePromise: Promise<unknown> | null = null;

const isPosition = (value: unknown): value is Position => [-2, -1, 0, 1, 2].includes(value as number);
const responseLabel = (value: Position) => value === -2 ? "discordo totalmente" : value === -1 ? "discordo" : value === 0 ? "nem concordo nem discordo" : value === 1 ? "concordo" : "concordo totalmente";

export async function generateOnDeviceNarrative(item: ProgramScore, answers: Record<string, Answer>) {
  const fallback = deterministicNarrative(item, answers);
  if (!(navigator as Navigator & { gpu?: unknown }).gpu) {
    return { text: fallback, mode: "fallback" as const, reason: "Seu navegador não oferece WebGPU." };
  }

  try {
    const webllm = await import("@mlc-ai/web-llm");
    if (!enginePromise) {
      enginePromise = webllm.CreateMLCEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC");
    }
    const engine = await enginePromise as Awaited<ReturnType<typeof webllm.CreateMLCEngine>>;
    const comparisons = questions
      .map((question) => {
        const answer = answers[question.id];
        const position = item.program.positions[question.id];
        const evidence = item.program.evidences.find((entry) => entry.id === question.id);
        if (!isPosition(answer) || !isPosition(position) || !evidence) return null;
        return { question, answer, position, evidence, affinity: 1 - Math.abs(answer - position) / 4 };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
    const selectedComparisons = [...comparisons].sort((a, b) => b.affinity - a.affinity).slice(0, 2)
      .concat([...comparisons].sort((a, b) => a.affinity - b.affinity).slice(0, 2));
    const evidence = selectedComparisons
      .map((entry) => `[${entry.question.id}] Eixo: ${entry.question.axis}. Resposta do eleitor: ${responseLabel(entry.answer)}. Posição documentada: ${responseLabel(entry.position)}. Citação: “${entry.evidence.quote}” (p. ${entry.evidence.page}).`)
      .join("\n");
    const meta = getProgramMeta(item.program.program);
    const prompt = `Programa: ${meta.name}. Afinidade calculada: ${Math.round((item.score ?? 0) * 100)}%.
Use exclusivamente as comparações abaixo. Não use conhecimento externo, não invente posição, não recomende voto e não mencione temas que não constam nas linhas.
Comparações resposta-a-resposta:\n${evidence || "Sem comparações documentais suficientes."}`;
    const completion = await engine.chat.completions.create({
      messages: [
        { role: "system", content: "Escreva um único parágrafo em português brasileiro, com até 95 palavras. Explique somente convergências e divergências que apareçam textualmente nas comparações fornecidas. Cite pelo menos uma página entre parênteses. Não recomende voto, não acrescente fatos, não faça juízos morais e não use linguagem persuasiva." },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 170,
    });
    const text = completion.choices[0]?.message?.content?.trim();
    return text ? { text, mode: "local-llm" as const } : { text: fallback, mode: "fallback" as const, reason: "O modelo não retornou texto." };
  } catch {
    return { text: fallback, mode: "fallback" as const, reason: "Não foi possível iniciar o modelo local neste dispositivo." };
  }
}
