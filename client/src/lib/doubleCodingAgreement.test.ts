import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calculateDoubleCodingAgreement } from "../../../scripts/analyze-double-coding.mjs";

describe("double coding agreement", () => {
  it("separa concordância sobre evidência da concordância ordinal sobre intensidade", () => {
    const result = calculateDoubleCodingAgreement([
      { caseId: "DC-01", originalPosition: 2, reviewer2Position: 2, originalConfidence: 0.9, reviewer2Confidence: 0.9 },
      { caseId: "DC-02", originalPosition: null, reviewer2Position: null, originalConfidence: null, reviewer2Confidence: null },
      { caseId: "DC-03", originalPosition: -1, reviewer2Position: 1, originalConfidence: 0.8, reviewer2Confidence: 0.8 },
    ]);
    expect(result.positionPresenceAgreement).toBe(1);
    expect(result.jointlyPositionedCells).toBe(2);
    expect(result.exactPositionAgreementAmongJointlyPositioned).toBe(0.5);
    expect(result.cellsRequiringReconciliation).toEqual(["DC-03"]);
  });

  it("mantém a folha do segundo codificador cega às decisões do primeiro", () => {
    const template = JSON.parse(readFileSync(new URL("../../../review/double-coding/reviewer-2-blind-template.json", import.meta.url), "utf8"));
    expect(template.assignments).toHaveLength(600);
    expect(template.assignments.every((entry: Record<string, unknown>) => !Object.hasOwn(entry, "originalPosition") && !Object.hasOwn(entry, "originalConfidence") && !Object.hasOwn(entry, "originalEvidence"))).toBe(true);
  });
});
