import { axisOrder, getProgramMeta, type Answer, type Axis, type Position, programs, questions, type Program } from "@/data/compassData";

export const MINIMUM_COMPARISONS_FOR_RANKING = 8;
export const MINIMUM_COVERAGE_FOR_RANKING = 0.4;
export const MINIMUM_COMPARISONS_FOR_COORDINATE = 3;

export type AxisScore = { axis: Axis; score: number | null; coverage: number | null; compared: number; answered: number };
export type Comparability = "comparable" | "insufficient" | "unavailable";
export type ProgramScore = {
  program: Program;
  score: number | null;
  coverage: number | null;
  compared: number;
  answered: number;
  comparability: Comparability;
  axes: AxisScore[];
  economic: number | null;
  social: number | null;
  economicCompared: number;
  socialCompared: number;
};

const valid = (value: unknown): value is Position => [-2, -1, 0, 1, 2].includes(value as number);

export function weightedAffinity(answer: Position, position: Position) {
  return 1 - Math.abs(answer - position) / 4;
}

export function normalizedCoordinate(values: { value: Position; factor: number }[]) {
  const denominator = values.reduce((total, item) => total + Math.abs(item.factor), 0);
  if (!denominator) return null;
  return values.reduce((total, item) => total + item.value * item.factor, 0) / denominator;
}

export function scoreProgram(program: Program, answers: Record<string, Answer>, weights: Record<Axis, number>): ProgramScore {
  let denominator = 0;
  let numerator = 0;
  const axisScores: AxisScore[] = axisOrder.map((axis) => {
    let axisNumerator = 0;
    let axisDenominator = 0;
    let answered = 0;
    let covered = 0;
    questions.filter((question) => question.axis === axis).forEach((question) => {
      const answer = answers[question.id];
      if (!valid(answer)) return;
      answered += 1;
      const position = program.positions[question.id];
      if (!valid(position)) return;
      covered += 1;
      const confidence = program.confidences?.[question.id] ?? 1;
      const weight = (weights[axis] ?? 1) * confidence;
      const affinity = weightedAffinity(answer, position);
      axisNumerator += affinity * weight;
      axisDenominator += weight;
      numerator += affinity * weight;
      denominator += weight;
    });
    return { axis, score: axisDenominator ? axisNumerator / axisDenominator : null, coverage: answered ? covered / answered : null, compared: covered, answered };
  });

  const dimensionValues = (key: "economic" | "social", source: Record<string, Position | null>) => questions
    .filter((question) => question[key] !== undefined && valid(source[question.id]))
    .map((question) => ({ value: source[question.id] as Position, factor: question[key] as number }));

  const answered = axisScores.reduce((sum, axis) => sum + axis.answered, 0);
  const compared = axisScores.reduce((sum, axis) => sum + axis.compared, 0);
  const coverage = answered ? compared / answered : null;
  const score = denominator ? numerator / denominator : null;
  const dimension = (key: "economic" | "social", source: Record<string, Position | null>) => {
    const values = dimensionValues(key, source);
    return { value: values.length >= MINIMUM_COMPARISONS_FOR_COORDINATE ? normalizedCoordinate(values) : null, compared: values.length };
  };
  const economic = dimension("economic", program.positions);
  const social = dimension("social", program.positions);
  const comparability: Comparability = score === null || coverage === null
    ? "unavailable"
    : compared >= MINIMUM_COMPARISONS_FOR_RANKING && coverage >= MINIMUM_COVERAGE_FOR_RANKING
      ? "comparable"
      : "insufficient";

  return {
    program,
    score,
    coverage,
    compared,
    answered,
    comparability,
    axes: axisScores,
    economic: economic.value,
    social: social.value,
    economicCompared: economic.compared,
    socialCompared: social.compared,
  };
}

export function orderProgramScores(scores: ProgramScore[]) {
  const rank = (item: ProgramScore) => item.comparability === "comparable" ? 2 : item.comparability === "insufficient" ? 1 : 0;
  return [...scores].sort((a, b) => rank(b) - rank(a) || (b.score ?? -1) - (a.score ?? -1) || (b.coverage ?? -1) - (a.coverage ?? -1) || b.compared - a.compared || a.program.program.localeCompare(b.program.program));
}

export function scoreAll(answers: Record<string, Answer>, weights: Record<Axis, number>) {
  return orderProgramScores(programs.map((program) => scoreProgram(program, answers, weights)));
}

export function userCoordinates(answers: Record<string, Answer>) {
  const coordinates = (key: "economic" | "social") => {
    const values = questions
    .filter((question) => question[key] !== undefined && valid(answers[question.id]))
    .map((question) => ({ value: answers[question.id] as Position, factor: question[key] as number }));
    return { value: values.length >= MINIMUM_COMPARISONS_FOR_COORDINATE ? normalizedCoordinate(values) : null, compared: values.length };
  };
  const economic = coordinates("economic");
  const social = coordinates("social");
  return { economic: economic.value, social: social.value, economicCompared: economic.compared, socialCompared: social.compared };
}

export function deterministicNarrative(item: ProgramScore, answers: Record<string, Answer> = {}) {
  const meta = getProgramMeta(item.program.program).name;
  const affinity = item.score === null ? "não pôde ser calculada" : `${Math.round(item.score * 100)}%`;
  const comparisons = questions
    .map((question) => {
      const answer = answers[question.id];
      const position = item.program.positions[question.id];
      if (!valid(answer) || !valid(position)) return null;
      return { question, answer, position, affinity: weightedAffinity(answer, position), evidence: item.program.evidences.find((entry) => entry.id === question.id) };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .filter((entry) => entry.evidence);
  const best = [...comparisons].sort((a, b) => b.affinity - a.affinity).find((entry) => entry.affinity >= 0.75);
  const lowest = [...comparisons].sort((a, b) => a.affinity - b.affinity).find((entry) => entry.affinity <= 0.25);
  const response = (value: Position) => value === -2 ? "discordância total" : value === -1 ? "discordância" : value === 0 ? "posição intermediária" : value === 1 ? "concordância" : "concordância total";
  const bestText = best ? `Há convergência alta em ${best.question.axis.toLocaleLowerCase("pt-BR")}: sua ${response(best.answer)} coincide com a posição documentada para “${best.evidence?.quote}” (p. ${best.evidence?.page}).` : comparisons.length ? "Não foi identificada convergência alta entre as comparações documentais disponíveis." : "Não há uma comparação resposta-a-resposta com evidência suficiente para detalhar convergências.";
  const lowText = lowest ? `A maior distância observada aparece em ${lowest.question.axis.toLocaleLowerCase("pt-BR")}: sua ${response(lowest.answer)} difere da posição associada a “${lowest.evidence?.quote}” (p. ${lowest.evidence?.page}).` : "";
  return `${meta} apresenta afinidade calculada de ${affinity}, considerando apenas respostas com posição programática documentada. ${bestText} ${lowText} Isso descreve concordância programática; não é recomendação de voto.`;
}
