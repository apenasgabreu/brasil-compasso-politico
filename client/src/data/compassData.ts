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
  { id: "ECO-04", axis: "Economia e orçamento", text: "O governo deve priorizar o controle da dívida e gastar menos do que arrecada, mesmo que isso limite novos gastos públicos.", economic: 1 },
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
  { id: "CID-02", axis: "Cidades, moradia e infraestrutura", text: "Empresas privadas devem poder ajudar a ampliar estradas, transporte de cargas, água e esgoto por meio de parcerias com o governo." },
  { id: "CID-03", axis: "Cidades, moradia e infraestrutura", text: "Imóveis urbanos vazios devem poder ser destinados a moradia popular." },
  { id: "CID-04", axis: "Cidades, moradia e infraestrutura", text: "O transporte coletivo deve caminhar para tarifa zero ou forte subsídio público." },
  { id: "CID-05", axis: "Cidades, moradia e infraestrutura", text: "O governo deve facilitar documentos que reconheçam quem mora ou trabalha em um terreno, dando mais segurança para permanecer no local." },
  { id: "AMB-01", axis: "Ambiente, energia e agricultura", text: "A política climática deve priorizar a redução de emissões, mesmo que imponha limites a atividades econômicas." },
  { id: "AMB-02", axis: "Ambiente, energia e agricultura", text: "O Brasil deve acelerar o uso de energia renovável, como sol e vento, e depender menos de petróleo, carvão e gás." },
  { id: "AMB-03", axis: "Ambiente, energia e agricultura", text: "Mercados de carbono e pagamento por serviços ambientais devem remunerar quem preserva." },
  { id: "AMB-04", axis: "Ambiente, energia e agricultura", text: "O licenciamento ambiental deve ser simplificado e ter prazos definidos para projetos de baixo risco." },
  { id: "AMB-05", axis: "Ambiente, energia e agricultura", text: "A reforma agrária e o apoio à agricultura familiar devem ser prioridades nacionais." },
  { id: "SEG-01", axis: "Segurança e justiça", text: "O combate ao crime organizado deve ampliar integração policial, inteligência e controle de ativos financeiros." },
  { id: "SEG-02", axis: "Segurança e justiça", text: "As leis penais devem ser endurecidas para crimes graves, mesmo que isso resulte em mais tempo de prisão.", social: -1 },
  { id: "SEG-03", axis: "Segurança e justiça", text: "A segurança pública deve ter mais controle sobre a atuação policial, menos foco em prisões e mudar o modelo militar das polícias.", social: 1 },
  { id: "SEG-04", axis: "Segurança e justiça", text: "As Forças Armadas devem ter maior atuação em fronteiras e operações de segurança." },
  { id: "SEG-05", axis: "Segurança e justiça", text: "O sistema prisional deve priorizar separação de lideranças, educação, trabalho e reinserção social." },
  { id: "DIR-01", axis: "Direitos e igualdade", text: "O Estado deve ampliar políticas específicas para reduzir desigualdades de raça e gênero.", social: 1 },
  { id: "DIR-02", axis: "Direitos e igualdade", text: "O acesso a creche e redes públicas de cuidado deve ser ampliado para apoiar famílias e trabalho.", social: 1 },
  { id: "DIR-03", axis: "Direitos e igualdade", text: "Terras de povos indígenas e de comunidades quilombolas devem ter seus limites reconhecidos e receber proteção prioritária.", social: 1 },
  { id: "DIR-04", axis: "Direitos e igualdade", text: "O Estado deve ampliar políticas de proteção e direitos para pessoas LGBTQIA+.", social: 1 },
  { id: "DIR-05", axis: "Direitos e igualdade", text: "A interrupção voluntária da gravidez deve ser legalizada e ofertada pela rede pública.", social: 1 },
  { id: "DEM-01", axis: "Democracia e instituições", text: "O orçamento público deve ter formas permanentes para a população participar e ajudar a decidir como o dinheiro será usado." },
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
  { id: "CTD-03", axis: "Ciência, tecnologia e desenvolvimento", text: "O Brasil deve ampliar internet e inteligência artificial, protegendo dados pessoais e mantendo regras públicas claras." },
  { id: "CTD-04", axis: "Ciência, tecnologia e desenvolvimento", text: "A exploração de minerais estratégicos, como terras raras, deve gerar mais processamento no Brasil e manter controle nacional." },
  { id: "CTD-05", axis: "Ciência, tecnologia e desenvolvimento", text: "Regiões mais pobres devem receber infraestrutura e políticas próprias para reduzir diferenças entre as regiões do país." },
];

export const programs = rawPositions.programs as unknown as Program[];

const sourceFiles = [
  ["zema", "Romeu Zema — NOVO", "Programa de Governo", "/manus-storage/planogoverno10120_8052fe22.pdf"],
  ["democrata", "Wilson Grassi — Democrata", "Brasil em Primeiro Lugar", "/manus-storage/BrasilemPrimeiroLugar_548312dd.pdf"],
  ["samara", "Samara Martins — UP", "Programa de Governo", "/manus-storage/pje-ProgramaSAMARA_02(1)_c70778e3.pdf"],
  ["pco", "Rui Costa Pimenta — PCO", "Programa de Governo 2026", "/manus-storage/PCOprogramadegoverno2026_5fd19712.pdf"],
  ["caiado", "Ronaldo Caiado — PSD", "Plano de Governo", "/manus-storage/PlanodeGovernoRonaldoCaiadoPresidente_ac37d7fc.pdf"],
  ["renan", "Renan Santos — Partido Missão", "Plano de Governo", "/manus-storage/PlanodeGovernoMissao2026Finalcompressed_3b09ae48.pdf"],
  ["lula", "Luiz Inácio Lula da Silva — coligação", "Livro do Plano de Governo", "/manus-storage/0806JOB838PTlivroplanodegovernocompressed_ca43cf1e.pdf"],
  ["pstu", "Hertz Dias — PSTU", "Programa Eleições 2026", "/manus-storage/ProgramaPSTUEleiAAes2026_5920ff3c.pdf"],
  ["flávio", "Flávio Bolsonaro — PL", "Diretrizes de Plano de Governo", "/manus-storage/DiretrizesPlanodeGovernoFlavioBolsonaro20272030versaofinal_36dd945a.pdf"],
  ["augusto", "Augusto Cury", "Plano de Governo", "/manus-storage/PLANODEGOVERNOOBRASILDOSNOSSOSSONHOS_555f1710.pdf"],
  ["pcb", "Edmilson Costa e Cleusa Santos — PCB", "Programa Político", "/manus-storage/ProgramaPoliticodoPCBeleicoes20261_7be57e53.pdf"],
  ["proteger", "Clariana Barão — Democracia Cristã", "Proteger Hoje, Transformar o Amanhã", "/manus-storage/PLANODEGOVERNO_7020aa1e.pdf"],
] as const;

export type CandidatePortrait = { name: string; image: string; source: string; credit: string };

const candidatePortraits: Record<string, CandidatePortrait[]> = {
  "Romeu Zema — NOVO": [{ name: "Romeu Zema", image: "/manus-storage/romeu-zema_380554f5.jpg", source: "https://commons.wikimedia.org/wiki/File:Romeu_Zema_2025_(cropped).jpg", credit: "Wikimedia Commons · CC BY 4.0" }],
  "Samara Martins — UP": [{ name: "Samara Martins", image: "/manus-storage/samara-martins_2eb2ee23.jpg", source: "https://commons.wikimedia.org/wiki/File:Samara_Martins_UP.jpg", credit: "Wikimedia Commons · atribuição indicada na fonte" }],
  "Ronaldo Caiado — PSD": [{ name: "Ronaldo Caiado", image: "/manus-storage/ronaldo-caiado_e98d53c5.jpg", source: "https://commons.wikimedia.org/wiki/File:Foto_oficial_do_governador_de_Goi%C3%A1s,_Ronaldo_Caiado_em_2023_(ombros).jpg", credit: "Bianca Kida · CC BY 2.0" }],
  "Renan Santos — Partido Missão": [{ name: "Renan Santos", image: "/manus-storage/renan-santos_691a460c.jpg", source: "https://commons.wikimedia.org/wiki/File:Renan_Santos.jpg", credit: "Romerito Pontes · CC BY 4.0" }],
  "Luiz Inácio Lula da Silva — coligação": [{ name: "Luiz Inácio Lula da Silva", image: "/manus-storage/lula-rosto_2656dea4.jpg", source: "https://commons.wikimedia.org/wiki/File:Foto_oficial_de_Luiz_In%C3%A1cio_Lula_da_Silva_(rosto)_(cropped).jpg", credit: "Palácio do Planalto · CC BY 2.0" }],
  "Flávio Bolsonaro — PL": [{ name: "Flávio Bolsonaro", image: "/manus-storage/flavio-bolsonaro_8022afb1.jpg", source: "https://commons.wikimedia.org/wiki/File:Flavio_Bolsonaro_em_2006.jpg", credit: "Wikimedia Commons · CC BY 4.0" }],
  "Augusto Cury": [{ name: "Augusto Cury", image: "/manus-storage/augusto-cury_252b0a4e.jpg", source: "https://commons.wikimedia.org/wiki/File:Augusto_Cury,_escritor_(28339139296).jpg", credit: "Lima Andruška · CC BY-SA 2.0" }],
  "Edmilson Costa e Cleusa Santos — PCB": [{ name: "Edmilson Costa", image: "/manus-storage/edmilson-costa_a47ac5e9.jpg", source: "https://commons.wikimedia.org/wiki/File:Edmilson_Costa_-_PCB.jpg", credit: "PCB/Diário Liberdade · CC BY 3.0" }],
  "Wilson Grassi — Democrata": [{ name: "Wilson Grassi", image: "/manus-storage/wilson-grassi-tse_781f214d.jpg", source: "https://commons.wikimedia.org/wiki/File:2026_VETERIN%C3%81RIO_WILSON_GRASSI_CANDIDATO_PRESIDENTE_TSE_(280002548139).jpg", credit: "TSE · CC BY 4.0" }],
  "Hertz Dias — PSTU": [{ name: "Hertz Dias", image: "/manus-storage/hertz-dias-tse_4efe41ed.jpg", source: "https://commons.wikimedia.org/wiki/File:2026_HERTZ_DIAS_CANDIDATO_PRESIDENTE_TSE_(280002541457).jpg", credit: "TSE · CC BY 4.0" }],
  "Rui Costa Pimenta — PCO": [{ name: "Rui Costa Pimenta", image: "/manus-storage/rui-costa-pimenta-tse_9512a4d6.jpg", source: "https://commons.wikimedia.org/wiki/File:2026_RUI_COSTA_PIMENTA_CANDIDATO_PRESIDENTE_TSE_(280002552487).jpg", credit: "TSE · CC BY 4.0" }],
  "Clariana Barão — Democracia Cristã": [{ name: "Clariana Barão", image: "/manus-storage/clariana-barao_47a8443a.jpg", source: "https://www.democraciacrista.org.br/clariana-e-a-indicada-na-convencao-nacional-para-presidencia-da-republica-pela-democracia-crista/", credit: "Democracia Cristã · imagem institucional" }],
};

export function getProgramMeta(program: string) {
  const normalized = program.toLocaleLowerCase("pt-BR");
  const found = sourceFiles.find(([needle]) => normalized.includes(needle));
  return found
    ? { name: found[1], document: found[2], url: found[3], portraits: candidatePortraits[found[1]] ?? [], identifiable: true }
    : { name: program, document: "Documento programático", url: "#", portraits: [], identifiable: false };
}

export const responseOptions: { value: Position; label: string }[] = [
  { value: -2, label: "Discordo totalmente" }, { value: -1, label: "Discordo" }, { value: 0, label: "Nem concordo nem discordo" }, { value: 1, label: "Concordo" }, { value: 2, label: "Concordo totalmente" },
];

export const contextualSourcePolicy = {
  title: "Brasil no espelho (Felipe Nunes, 2025)",
  classification: "Leitura contextual; não é usada como literatura revisada por pares.",
  exclusion: "Não influencia posições, pesos, ranking, cobertura ou pontuação.",
};
