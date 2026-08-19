import { describe, expect, it } from "vitest";
import { deterministicNarrative, normalizedCoordinate, orderProgramScores, scoreProgram, weightedAffinity } from "./scoring";
import { questions, type Axis, type Program } from "@/data/compassData";

const weights = Object.fromEntries([
  "Economia e orçamento", "Trabalho e proteção social", "Saúde e educação", "Cidades, moradia e infraestrutura", "Ambiente, energia e agricultura", "Segurança e justiça", "Direitos e igualdade", "Democracia e instituições", "Política externa e defesa", "Ciência, tecnologia e desenvolvimento",
].map((axis) => [axis, 1])) as Record<Axis, number>;

describe("scoring", () => {
  it("calcula afinidade máxima para posições idênticas e mínima para posições opostas", () => {
    expect(weightedAffinity(2, 2)).toBe(1);
    expect(weightedAffinity(-2, 2)).toBe(0);
  });

  it("ignora uma resposta não respondida em vez de convertê-la em neutralidade", () => {
    const program: Program = { program: "Teste", positions: { "ECO-01": 2, "ECO-02": -2 }, evidences: [], limitations: "" };
    const result = scoreProgram(program, { "ECO-01": 2, "ECO-02": null }, weights);
    expect(result.score).toBe(1);
    expect(result.axes.find((axis) => axis.axis === "Economia e orçamento")?.compared).toBe(1);
  });

  it("não atribui cobertura para posições documentais ausentes", () => {
    const program: Program = { program: "Teste", positions: { "ECO-01": null }, evidences: [], limitations: "" };
    const result = scoreProgram(program, { "ECO-01": 2 }, weights);
    expect(result.score).toBeNull();
    expect(result.axes.find((axis) => axis.axis === "Economia e orçamento")?.coverage).toBe(0);
  });

  it("calcula cobertura global pelos itens respondidos, sem punir eixos não respondidos", () => {
    const secondQuestion = questions.find((question) => question.axis !== "Economia e orçamento");
    if (!secondQuestion) throw new Error("Pergunta de outro eixo não encontrada");
    const program: Program = { program: "Teste", positions: { "ECO-01": 2, [secondQuestion.id]: -2 }, evidences: [], limitations: "" };
    const result = scoreProgram(program, { "ECO-01": 2 }, weights);
    expect(result.coverage).toBe(1);
    expect(result.answered).toBe(1);
    expect(result.compared).toBe(1);
    expect(result.axes.find((axis) => axis.axis === secondQuestion.axis)?.coverage).toBeNull();
  });

  it("separa resultados com dados insuficientes e ordena os comparáveis por afinidade, não por cobertura", () => {
    const base = scoreProgram({ program: "Base", positions: { "ECO-01": 2 }, evidences: [], limitations: "" }, { "ECO-01": 2 }, weights);
    const highCoverageLowerAffinity = { ...base, program: { ...base.program, program: "Cobertura alta" }, score: 0.57, coverage: 0.9, compared: 18, answered: 20, comparability: "comparable" as const };
    const highAffinityLowerCoverage = { ...base, program: { ...base.program, program: "Afinidade alta" }, score: 0.91, coverage: 0.55, compared: 11, answered: 20, comparability: "comparable" as const };
    const insufficient = { ...base, program: { ...base.program, program: "Insuficiente" }, score: 1, coverage: 0.2, compared: 4, answered: 20, comparability: "insufficient" as const };
    expect(orderProgramScores([insufficient, highCoverageLowerAffinity, highAffinityLowerCoverage]).map((item) => item.program.program)).toEqual(["Afinidade alta", "Cobertura alta", "Insuficiente"]);
  });

  it("normaliza coordenadas pela soma dos fatores absolutos", () => {
    expect(normalizedCoordinate([{ value: 2, factor: 0.5 }, { value: 2, factor: 1.5 }])).toBe(2);
    expect(normalizedCoordinate([{ value: -2, factor: -1 }, { value: 2, factor: 1 }])).toBe(2);
  });

  it("preserva simetria e intervalo da afinidade para toda a escala", () => {
    [-2, -1, 0, 1, 2].forEach((answer) => [-2, -1, 0, 1, 2].forEach((position) => {
      expect(weightedAffinity(answer as -2 | -1 | 0 | 1 | 2, position as -2 | -1 | 0 | 1 | 2)).toBe(weightedAffinity(position as -2 | -1 | 0 | 1 | 2, answer as -2 | -1 | 0 | 1 | 2));
      expect(weightedAffinity(answer as -2 | -1 | 0 | 1 | 2, position as -2 | -1 | 0 | 1 | 2)).toBeGreaterThanOrEqual(0);
      expect(weightedAffinity(answer as -2 | -1 | 0 | 1 | 2, position as -2 | -1 | 0 | 1 | 2)).toBeLessThanOrEqual(1);
    }));
  });

  it("aplica a confiança documental como multiplicador do peso do item", () => {
    const program: Program = { program: "Teste", positions: { "ECO-01": 2, "ECO-02": -2 }, confidences: { "ECO-01": 1, "ECO-02": 0.5 }, evidences: [], limitations: "" };
    const result = scoreProgram(program, { "ECO-01": 2, "ECO-02": 2 }, weights);
    expect(result.score).toBeCloseTo(2 / 3, 5);
  });

  it("não descreve uma divergência isolada como convergência", () => {
    const program: Program = { program: "Teste", positions: { "ECO-01": -2 }, confidences: { "ECO-01": 1 }, evidences: [{ id: "ECO-01", axis: "Economia e orçamento", position: -2, page: "8", quote: "Proposta documental" }], limitations: "" };
    const result = scoreProgram(program, { "ECO-01": 2 }, weights);
    const text = deterministicNarrative(result, { "ECO-01": 2 });
    expect(text).toContain("Não foi identificada convergência alta");
    expect(text).toContain("maior distância observada");
  });
});
