import rawPositions from "../../../shared/compassPositions.json";

export type Position = -2 | -1 | 0 | 1 | 2;
export type Answer = Position | null | undefined;

export type Axis =
  | "Economia e orçamento"
  | "Trabalho e proteção social"
  | "Saúde e educação"
  | "Cidades, moradia e infraestrutura"
  | "Ambiente, energia e agricultura"
  | "Segurança e justiça"
  | "Direitos e igualdade"
  | "Democracia e instituições"
  | "Política externa e defesa"
  | "Ciência, tecnologia e desenvolvimento";

export type Question = { id: string; axis: Axis; text: string; economic?: number; social?: number };
export type Evidence = { id: string; axis: string; position: Position; page: string; quote: string; confidence?: number };
export type Program = { program: string; positions: Record<string, Position | null>; confidences?: Record<string, number>; evidences: Evidence[]; limitations: string };

export const axisOrder: Axis[] = [
  "Economia e orçamento", "Trabalho e proteção social", "Saúde e educação", "Cidades, moradia e infraestrutura",
  "Ambiente, energia e agricultura", "Segurança e justiça", "Direitos e igualdade", "Democracia e instituições",
  "Política externa e defesa", "Ciência, tecnologia e desenvolvimento",
];

export const questions: Question[] = [
  { id: "ECO-01", axis: "Economia e orçamento", text: "O Estado deve ampliar a atuação direta em setores estratégicos da economia, mesmo que reduza espaço para empresas privadas.", economic: -1 },
  { id: "ECO-02", axis: "Economia e orçamento", text: "A redução de impostos e de gastos públicos deve ser prioridade para melhorar a atividade econômica.", economic: 1 },
  { id: "ECO-03", axis: "Economia e orçamento", text: "Impostos sobre renda, heranças e patrimônio elevados devem financiar maior parte dos serviços públicos.", economic: -1 },
  { id: "ECO-04", axis: "Economia e orçamento", text: "A política fiscal deve priorizar metas de dívida e superávit, mesmo quando isso limita a expansão de gastos.", economic: 1 },
  { id: "ECO-05", axis: "Economia e orçamento", text: "O Banco Central deve manter autonomia para definir a política monetária.", economic: 1 },
  { id: "TRA-01", axis: "Trabalho e proteção social", text: "A jornada legal de trabalho deve ser reduzida sem redução de salários." },
  { id: "TRA-02", axis: "Trabalho e proteção social", text: "As regras trabalhistas devem ser flexibilizadas para facilitar contratações e reduzir custos." },
  { id: "TRA-03", axis: "Trabalho e proteção social", text: "Benefícios sociais devem ser acompanhados por políticas de qualificação e inserção em trabalho." },
  { id: "TRA-04", axis: "Trabalho e proteção social", text: "Plataformas digitais devem garantir vínculo ou proteção trabalhista aos seus trabalhadores." },
  { id: "TRA-05", axis: "Trabalho e proteção social", text: "O salário mínimo deve crescer acima da inflação para aproximar-se de um patamar de subsistência." },
  { id: "SAE-01", axis: "Saúde e educação", text: "O SUS deve permanecer universal e ser ampliado por investimento público direto." },
  { id: "SAE-02", axis: "Saúde e educação", text: "O setor privado pode ser contratado de forma complementar para reduzir filas no atendimento de saúde." },
  { id: "SAE-03", axis: "Saúde e educação", text: "A educação pública deve ser a principal prioridade de financiamento, da creche à universidade." },
  { id: "SAE-04", axis: "Saúde e educação", text: "O acesso à universidade pública deve ser ampliado com redução de barreiras seletivas." },
  { id: "SAE-05", axis: "Saúde e educação", text: "Avaliações de aprendizagem devem orientar a gestão escolar e as políticas educacionais." },
  { id: "CID-01", axis: "Cidades, moradia e infraestrutura", text: "O governo federal deve financiar diretamente programas amplos de habitação popular." },
  { id: "CID-02", axis: "Cidades, moradia e infraestrutura", text: "Parcerias com empresas privadas e concessões devem ampliar infraestrutura de logística e saneamento." },
  { id: "CID-03", axis: "Cidades, moradia e infraestrutura", text: "Imóveis urbanos vazios devem poder ser destinados a moradia popular." },
  { id: "CID-04", axis: "Cidades, moradia e infraestrutura", text: "O transporte coletivo deve caminhar para tarifa zero ou forte subsídio público." },
  { id: "CID-05", axis: "Cidades, moradia e infraestrutura", text: "A regularização fundiária e a titulação devem ser priorizadas para ampliar a segurança de posse." },
  { id: "AMB-01", axis: "Ambiente, energia e agricultura", text: "A política climática deve priorizar a redução de emissões, mesmo que imponha limites a atividades econômicas." },
  { id: "AMB-02", axis: "Ambiente, energia e agricultura", text: "A transição energética deve acelerar fontes renováveis e reduzir dependência de combustíveis fósseis." },
  { id: "AMB-03", axis: "Ambiente, energia e agricultura", text: "Mercados de carbono e pagamento por serviços ambientais devem remunerar quem preserva." },
  { id: "AMB-04", axis: "Ambiente, energia e agricultura", text: "O licenciamento ambiental deve ser simplificado e ter prazos definidos para projetos de baixo risco." },
  { id: "AMB-05", axis: "Ambiente, energia e agricultura", text: "A reforma agrária e o apoio à agricultura familiar devem ser prioridades nacionais." },
  { id: "SEG-01", axis: "Segurança e justiça", text: "O combate ao crime organizado deve ampliar integração policial, inteligência e controle de ativos financeiros." },
  { id: "SEG-02", axis: "Segurança e justiça", text: "As leis penais devem ser endurecidas para crimes graves, mesmo que isso resulte em mais tempo de prisão.", social: -1 },
  { id: "SEG-03", axis: "Segurança e justiça", text: "A segurança pública deve priorizar desmilitarização, controle da atividade policial e redução do encarceramento.", social: 1 },
  { id: "SEG-04", axis: "Segurança e justiça", text: "As Forças Armadas devem ter maior atuação em fronteiras e operações de segurança." },
  { id: "SEG-05", axis: "Segurança e justiça", text: "O sistema prisional deve priorizar separação de lideranças, educação, trabalho e reinserção social." },
  { id: "DIR-01", axis: "Direitos e igualdade", text: "O Estado deve ampliar políticas específicas para reduzir desigualdades de raça e gênero.", social: 1 },
  { id: "DIR-02", axis: "Direitos e igualdade", text: "O acesso a creche e redes públicas de cuidado deve ser ampliado para apoiar famílias e trabalho.", social: 1 },
  { id: "DIR-03", axis: "Direitos e igualdade", text: "Terras indígenas e quilombolas devem ser demarcadas e protegidas com prioridade.", social: 1 },
  { id: "DIR-04", axis: "Direitos e igualdade", text: "O Estado deve ampliar políticas de proteção e direitos para pessoas LGBTQIA+.", social: 1 },
  { id: "DIR-05", axis: "Direitos e igualdade", text: "A interrupção voluntária da gravidez deve ser legalizada e ofertada pela rede pública.", social: 1 },
  { id: "DEM-01", axis: "Democracia e instituições", text: "O orçamento público deve incluir mecanismos permanentes de participação popular deliberativa." },
  { id: "DEM-02", axis: "Democracia e instituições", text: "A autonomia de estados e municípios deve aumentar, com mais recursos e responsabilidades locais." },
  { id: "DEM-03", axis: "Democracia e instituições", text: "Decisões monocráticas de tribunais superiores devem ser mais restritas." },
  { id: "DEM-04", axis: "Democracia e instituições", text: "A reeleição para cargos do Executivo deve ser extinta." },
  { id: "DEM-05", axis: "Democracia e instituições", text: "Plataformas digitais devem estar sujeitas a regras públicas de transparência e responsabilidade por conteúdos ilegais.", social: 1 },
  { id: "EXT-01", axis: "Política externa e defesa", text: "A política externa deve priorizar parcerias multilaterais e cooperação com diferentes regiões." },
  { id: "EXT-02", axis: "Política externa e defesa", text: "O Brasil deve ampliar a integração com países latino-americanos e do Sul Global." },
  { id: "EXT-03", axis: "Política externa e defesa", text: "O Brasil deve aproximar-se de padrões e acordos com países desenvolvidos para ampliar comércio e investimento." },
  { id: "EXT-04", axis: "Política externa e defesa", text: "A defesa nacional deve receber mais recursos e capacidade tecnológica." },
  { id: "EXT-05", axis: "Política externa e defesa", text: "A soberania sobre recursos naturais e dados estratégicos deve limitar dependência de empresas ou governos estrangeiros." },
  { id: "CTD-01", axis: "Ciência, tecnologia e desenvolvimento", text: "O Estado deve ampliar investimento direto em ciência e tecnologia públicas." },
  { id: "CTD-02", axis: "Ciência, tecnologia e desenvolvimento", text: "Universidades e empresas devem cooperar mais em pesquisa e inovação." },
  { id: "CTD-03", axis: "Ciência, tecnologia e desenvolvimento", text: "O Brasil deve desenvolver infraestrutura digital e inteligência artificial com proteção de dados e governança pública." },
  { id: "CTD-04", axis: "Ciência, tecnologia e desenvolvimento", text: "A exploração de minerais críticos e terras raras deve priorizar agregação de valor e controle nacional." },
  { id: "CTD-05", axis: "Ciência, tecnologia e desenvolvimento", text: "O desenvolvimento regional deve usar infraestrutura e políticas específicas para reduzir desigualdades territoriais." },
];

export const programs = rawPositions.programs as unknown as Program[];

const sourceFiles = [
  ["zema", "Romeu Zema — NOVO", "Programa de Governo", "/manus-storage/planogoverno10120_8052fe22.pdf"],
  ["democrata", "Partido Democrata", "Brasil em Primeiro Lugar", "/manus-storage/BrasilemPrimeiroLugar_548312dd.pdf"],
  ["samara", "Samara Martins — UP", "Programa de Governo", "/manus-storage/pje-ProgramaSAMARA_02(1)_c70778e3.pdf"],
  ["pco", "PCO", "Programa de Governo 2026", "/manus-storage/PCOprogramadegoverno2026_5fd19712.pdf"],
  ["caiado", "Ronaldo Caiado — PSD", "Plano de Governo", "/manus-storage/PlanodeGovernoRonaldoCaiadoPresidente_ac37d7fc.pdf"],
  ["renan", "Renan Santos — Partido Missão", "Plano de Governo", "/manus-storage/PlanodeGovernoMissao2026Finalcompressed_3b09ae48.pdf"],
  ["lula", "Luiz Inácio Lula da Silva — coligação", "Livro do Plano de Governo", "/manus-storage/0806JOB838PTlivroplanodegovernocompressed_ca43cf1e.pdf"],
  ["pstu", "PSTU", "Programa Eleições 2026", "/manus-storage/ProgramaPSTUEleiAAes2026_5920ff3c.pdf"],
  ["flávio", "Flávio Bolsonaro — PL", "Diretrizes de Plano de Governo", "/manus-storage/DiretrizesPlanodeGovernoFlavioBolsonaro20272030versaofinal_36dd945a.pdf"],
  ["augusto", "Augusto Cury", "Plano de Governo", "/manus-storage/PLANODEGOVERNOOBRASILDOSNOSSOSSONHOS_555f1710.pdf"],
  ["pcb", "Edmilson Costa e Cleusa Santos — PCB", "Programa Político", "/manus-storage/ProgramaPoliticodoPCBeleicoes20261_7be57e53.pdf"],
  ["proteger", "Programa sem candidatura identificada", "Proteger Hoje, Transformar o Amanhã", "/manus-storage/PLANODEGOVERNO_7020aa1e.pdf"],
] as const;

export function getProgramMeta(program: string) {
  const normalized = program.toLocaleLowerCase("pt-BR");
  const found = sourceFiles.find(([needle]) => normalized.includes(needle));
  return found
    ? { name: found[1], document: found[2], url: found[3], identifiable: !normalized.includes("sem autoria") }
    : { name: program, document: "Documento programático", url: "#", identifiable: false };
}

export const responseOptions: { value: Position; label: string }[] = [
  { value: -2, label: "Discordo totalmente" }, { value: -1, label: "Discordo" }, { value: 0, label: "Nem concordo nem discordo" }, { value: 1, label: "Concordo" }, { value: 2, label: "Concordo totalmente" },
];

export const contextualSourcePolicy = {
  title: "Brasil no espelho (Felipe Nunes, 2025)",
  classification: "Leitura contextual; não é usada como literatura revisada por pares.",
  exclusion: "Não influencia posições, pesos, ranking, cobertura ou pontuação.",
};
