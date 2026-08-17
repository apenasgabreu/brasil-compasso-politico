import { describe, expect, it } from "vitest";
import { deterministicNarrative, scoreProgram, weightedAffinity } from "./scoring";
import type { Axis, Program } from "@/data/compassData";

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
