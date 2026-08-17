import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Radar, RadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Copy, Cpu, Download, ExternalLink, FileText, Info, Loader2, LockKeyhole, Map, RotateCcw, Scale, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { axisOrder, contextualSourcePolicy, getProgramMeta, programs, questions, responseOptions, type Answer, type Axis } from "@/data/compassData";
import { deterministicNarrative, scoreAll, userCoordinates, type ProgramScore } from "@/lib/scoring";
import { generateOnDeviceNarrative } from "@/lib/localNarrative";
import { buildShareText, copyShareText, shareNativeResult, shareStory, socialLink, type ShareResult } from "@/lib/resultShare";

type Screen = "intro" | "weights" | "quiz" | "results" | "detail" | "method";
const COLORS = ["#9f4b2d", "#1f5d72", "#b48630", "#5a7382", "#ba6c4c", "#355b47", "#8060a4", "#9a7922", "#aa4c5d", "#386982", "#4b6650", "#716957"];
const defaultWeights = Object.fromEntries(axisOrder.map((axis) => [axis, 1])) as Record<Axis, number>;
export const journeyGuidance = {
  intro: { title: "Responda a partir das suas prioridades", text: "Não existe resposta certa. O teste compara o que você pensa com o que os programas documentam; ele não mede conhecimento político nem recomenda voto." },
  weights: { title: "O peso é seu", text: "Aumentar um peso dá mais importância àquele tema no seu resultado. Isso não muda a posição de nenhum programa." },
  quiz: { title: "Não é uma prova", text: "Marque o que melhor representa sua posição hoje. Se preferir não responder, use essa opção: ela não vira uma resposta neutra." },
  results: { title: "Leia afinidade e cobertura juntas", text: "Afinidade mostra acordo nos itens comparáveis. Cobertura mostra quanto o programa permitiu comparar. Nenhum dos dois números é uma nota da candidatura." },
  detail: { title: "Confira antes de concluir", text: "Use os trechos e as páginas para ver de onde vem cada comparação. A ausência de uma proposta clara permanece como ausência." },
  method: { title: "Entenda primeiro, aprofunde se quiser", text: "Esta página resume o cálculo em linguagem simples. As fontes, fórmulas e documentos completos continuam disponíveis para consulta." },
} as const;

function percentage(value: number | null | undefined) { return value === null || value === undefined ? "—" : `${Math.round(value * 100)}%`; }
function answerCount(answers: Record<string, Answer>) { return questions.filter((question) => answers[question.id] !== undefined).length; }

function Pill({ children, kind = "neutral" }: { children: React.ReactNode; kind?: "neutral" | "accent" | "success" }) {
  return <span className={`pill pill-${kind}`}>{children}</span>;
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p className="section-copy">{text}</p>}</div>;
}

function Guidance({ item, className = "" }: { item: { title: string; text: string }; className?: string }) {
  return <aside className={`guidance-note ${className}`} role="note"><Info size={18} aria-hidden="true" /><div><strong>{item.title}</strong><p>{item.text}</p></div></aside>;
}

function Portraits({ portraits, compact = false, linked = true }: { portraits: ReturnType<typeof getProgramMeta>["portraits"]; compact?: boolean; linked?: boolean }) {
  if (!portraits.length) return null;
  return <div className={`portrait-stack ${compact ? "portrait-stack-compact" : ""}`} aria-label={`Retrato de ${portraits.map((portrait) => portrait.name).join(" e ")}`}>{portraits.map((portrait) => linked ? <a href={portrait.source} target="_blank" rel="noreferrer" title={`Fonte da foto: ${portrait.credit}`} key={portrait.name}><img src={portrait.image} alt={`Retrato de ${portrait.name}`} /></a> : <span className="portrait-static" title={`Fonte da foto: ${portrait.credit}`} key={portrait.name}><img src={portrait.image} alt={`Retrato de ${portrait.name}`} /></span>)}</div>;
}

export function ProgramCatalog() {
  return <div className="program-catalog">{programs.map((program) => { const meta = getProgramMeta(program.program); return <a key={program.program} href={meta.url} target="_blank" rel="noreferrer"><Portraits portraits={meta.portraits} compact linked={false} /><span>{meta.name}</span><small>{meta.document}</small><ExternalLink size={14} /></a>; })}</div>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [weights, setWeights] = useState<Record<Axis, number>>(defaultWeights);
  const [axisIndex, setAxisIndex] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [narratives, setNarratives] = useState<Record<string, { text: string; mode: "local-llm" | "fallback"; reason?: string }>>({});
  const [generating, setGenerating] = useState<string | null>(null);
  const [localConsent, setLocalConsent] = useState(false);
  const [notice, setNotice] = useState("");

  const results = useMemo(() => scoreAll(answers, weights), [answers, weights]);
  const coordinates = useMemo(() => userCoordinates(answers), [answers]);
  const selected = results.find((result) => result.program.program === selectedProgram) ?? results[0];
  const currentAxis = axisOrder[axisIndex];
  const pageQuestions = questions.filter((question) => question.axis === currentAxis);

  const navigate = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const startQuiz = () => navigate("quiz");
  const finishQuiz = () => {
    if (!answerCount(answers)) { setNotice("Responda ao menos uma afirmação para calcular afinidades."); return; }
    setNotice("");
    setSelectedProgram(results[0]?.program.program ?? null);
    navigate("results");
  };
  const reset = () => { setAnswers({}); setWeights(defaultWeights); setAxisIndex(0); setNarratives({}); setSelectedProgram(null); setNotice(""); navigate("intro"); };
  const openDetail = (result: ProgramScore) => { setSelectedProgram(result.program.program); navigate("detail"); };
  const generateNarrative = async (result: ProgramScore) => {
    if (!localConsent) { setNotice("Confirme que deseja baixar e executar o modelo local no seu dispositivo antes de gerar o texto com IA."); return; }
    setNotice(""); setGenerating(result.program.program);
    const narrative = await generateOnDeviceNarrative(result, answers);
    setNarratives((current) => ({ ...current, [result.program.program]: narrative }));
    setGenerating(null);
  };
  const shareData = (result: ProgramScore): ShareResult => { const meta = getProgramMeta(result.program.program); const [, party] = meta.name.split(" — "); return { candidate: meta.name, score: result.score, coverage: result.coverage, url: window.location.origin, portraitUrl: meta.portraits[0]?.image, document: meta.document, party, sourceUrl: new URL(meta.url, window.location.origin).toString() }; };
  const announce = (text: string) => { setNotice(text); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const shareSummary = async (result: ProgramScore) => { try { await shareNativeResult(shareData(result)); announce("O seletor de compartilhamento do seu dispositivo foi aberto. Nada foi enviado pela aplicação."); } catch (error) { announce(error instanceof Error ? error.message : "Não foi possível abrir o compartilhamento."); } };
  const copySummary = async (result: ProgramScore) => { try { await copyShareText(shareData(result)); announce("Resumo copiado. Você decide onde e se deseja colá-lo."); } catch (error) { announce(error instanceof Error ? error.message : "Não foi possível copiar o resumo."); } };
  const shareToStory = async (result: ProgramScore) => { try { const outcome = await shareStory(shareData(result)); announce(outcome === "shared" ? "O seletor do dispositivo foi aberto. Se Instagram aparecer entre as opções, escolha Story para publicar." : "O card foi baixado. Abra o Instagram e escolha-o ao criar um Story."); } catch (error) { announce(error instanceof Error ? error.message : "Não foi possível preparar o card de Story."); } };

  const renderIntro = () => <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="hero-grid">
    <div className="hero-copy">
      <div className="hero-badge"><Scale size={15} /> Comparação programática, não recomendação</div>
      <h1>Descubra afinidades. <em>Leia as evidências.</em></h1>
      <p className="lead">Um instrumento para comparar suas posições com propostas documentadas dos programas recebidos. Cada resultado mostra o que foi comparado, o que ficou sem cobertura e de onde vem cada citação.</p>
      <div className="readiness-strip" aria-label="Como se preparar para o teste"><span><Check size={14} /> Não há resposta certa</span><span><Scale size={14} /> Reserve 8–12 minutos</span><span><LockKeyhole size={14} /> Nada é salvo</span></div>
      <Guidance item={journeyGuidance.intro} className="intro-guidance" />
      <div className="hero-actions"><Button className="primary-cta" onClick={() => navigate("weights")}>Começar com privacidade <ArrowRight size={17} /></Button><Button variant="outline" className="soft-button" onClick={() => navigate("method")}>Conhecer o método</Button></div>
      <div className="privacy-row"><span><LockKeyhole size={15} /> Suas respostas ficam nesta aba.</span><span><ShieldCheck size={15} /> Sem cookies de rastreamento.</span></div>
    </div>
    <aside className="hero-panel" aria-label="Como o teste funciona">
      <p className="eyebrow">Como ler o resultado</p>
      <div className="process-item"><span>01</span><div><strong>Você responde</strong><p>50 afirmações organizadas em dez eixos, com opção de não responder.</p></div></div>
      <div className="process-item"><span>02</span><div><strong>Você pondera</strong><p>A importância dos temas é escolhida por você, sem alterar as posições dos programas.</p></div></div>
      <div className="process-item"><span>03</span><div><strong>Você confere</strong><p>O ranking vem acompanhado de cobertura, trechos e páginas do documento de origem.</p></div></div>
    </aside>
  </motion.div>;

  const renderWeights = () => <div className="narrow-stage"><SectionTitle eyebrow="Antes de começar" title="O que importa mais para você?" text="Aumente o peso dos temas que você considera decisivos. Todos começam com peso padrão; isso só muda a importância que suas próprias respostas terão no cálculo." /><Guidance item={journeyGuidance.weights} className="stage-guidance" />
    <div className="weight-list">{axisOrder.map((axis) => <label className="weight-row" key={axis}><div><strong>{axis}</strong><span>{weights[axis] === 1 ? "Peso padrão" : weights[axis] === 2 ? "Peso elevado" : "Peso máximo"}</span></div><input aria-label={`Importância de ${axis}`} type="range" min="1" max="3" step="1" value={weights[axis]} onChange={(event) => setWeights((current) => ({ ...current, [axis]: Number(event.target.value) }))} /><b>{weights[axis]}×</b></label>)}</div>
    <div className="stage-actions"><Button variant="outline" className="soft-button" onClick={() => navigate("intro")}><ArrowLeft size={16} /> Voltar</Button><Button className="primary-cta" onClick={startQuiz}>Ir ao questionário <ArrowRight size={17} /></Button></div>
  </div>;

  const renderQuiz = () => <div className="quiz-shell">
    <div className="quiz-top"><div><p className="eyebrow">Questionário · {axisIndex + 1} de {axisOrder.length}</p><h2>{currentAxis}</h2></div><div className="answered-box"><strong>{answerCount(answers)}</strong><span>de 50 marcadas</span></div></div>
    <div className="progress" aria-label={`Progresso: eixo ${axisIndex + 1} de ${axisOrder.length}`}><span style={{ width: `${((axisIndex + 1) / axisOrder.length) * 100}%` }} /></div>
    <Guidance item={journeyGuidance.quiz} className="quiz-guidance" />
    <div className="question-stack">{pageQuestions.map((question, index) => <fieldset className="question-card" key={question.id}><legend><span>{String(index + 1).padStart(2, "0")}</span>{question.text}</legend><div className="answer-grid">{responseOptions.map((option) => <label key={option.value} className={`answer-option ${answers[question.id] === option.value ? "selected" : ""}`}><input type="radio" name={question.id} checked={answers[question.id] === option.value} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))} /><span>{option.label}</span></label>)}<label className={`answer-option skip-option ${answers[question.id] === null ? "selected" : ""}`}><input type="radio" name={question.id} checked={answers[question.id] === null} onChange={() => setAnswers((current) => ({ ...current, [question.id]: null }))} /><span>Não sei / Prefiro não responder</span></label></div></fieldset>)}</div>
    {notice && <p className="notice" role="status">{notice}</p>}
    <div className="stage-actions quiz-actions"><Button variant="outline" className="soft-button" disabled={axisIndex === 0} onClick={() => setAxisIndex((value) => value - 1)}><ArrowLeft size={16} /> Eixo anterior</Button>{axisIndex < axisOrder.length - 1 ? <Button className="primary-cta" onClick={() => { setAxisIndex((value) => value + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Próximo eixo <ArrowRight size={17} /></Button> : <Button className="primary-cta" onClick={finishQuiz}>Ver resultados <ChevronRight size={17} /></Button>}</div>
  </div>;

  const renderResults = () => {
    const data = results.map((result, index) => ({ name: getProgramMeta(result.program.program).name.replace(" — ", "\n"), score: Math.round((result.score ?? 0) * 100), color: COLORS[index % COLORS.length] }));
    const radarPrograms = results.slice(0, 3);
    const radarData = axisOrder.map((axis) => Object.assign({ axis: axis.replace(" e ", " / ") }, ...radarPrograms.map((result, index) => ({ [`p${index}`]: Math.round((result.axes.find((item) => item.axis === axis)?.score ?? 0) * 100) }))));
    return <div className="results-shell"><SectionTitle eyebrow="Seu resultado" title="Afinidade programática com cobertura visível" text="O percentual abaixo compara somente suas respostas com posições que o documento formula de modo suficiente. Cobertura baixa significa que o programa não fala claramente sobre muitos itens que você respondeu." /><Guidance item={journeyGuidance.results} className="results-guidance" />
      <div className="result-feature"><div><Pill kind="accent">Maior afinidade documentada</Pill><Portraits portraits={getProgramMeta(results[0]?.program.program ?? "").portraits} /><h3>{getProgramMeta(results[0]?.program.program ?? "").name}</h3><div className="big-score">{percentage(results[0]?.score)}</div><p>Cobertura das respostas: <strong>{percentage(results[0]?.coverage)}</strong></p><Button className="primary-cta" onClick={() => openDetail(results[0])}>Ler evidências <BookOpen size={17} /></Button></div><div className="result-note"><Info size={18} /><p>Este ranking não mede intenção de voto, competência, viabilidade ou desempenho. Ele descreve proximidade em afirmações cobertas pelos documentos recebidos.</p></div></div>
      <label className="result-local-consent"><input type="checkbox" checked={localConsent} onChange={(event) => setLocalConsent(event.target.checked)} /> <span>Autorizo baixar e executar um modelo local neste dispositivo para gerar explicações. Suas respostas não saem do navegador.</span></label>{notice && <p className="notice" role="status">{notice}</p>}
      <section className="share-panel" aria-labelledby="share-title"><div><p className="eyebrow">Compartilhamento voluntário</p><h3 id="share-title">Seu resultado fica nesta aba. Compartilhe somente se quiser.</h3><p>O resumo mostra afinidade, cobertura e o aviso metodológico. Respostas individuais não entram no texto nem na imagem.</p></div><div className="share-actions"><Button className="primary-cta" onClick={() => shareSummary(results[0])}><Share2 size={16} /> Compartilhar</Button><Button variant="outline" className="soft-button" onClick={() => shareToStory(results[0])}><Download size={16} /> Preparar para Story</Button><Button variant="outline" className="soft-button" onClick={() => copySummary(results[0])}><Copy size={16} /> Copiar resumo</Button><a className="network-link" href={socialLink("whatsapp", shareData(results[0]))} target="_blank" rel="noreferrer">WhatsApp <ExternalLink size={13} /></a><a className="network-link" href={socialLink("x", shareData(results[0]))} target="_blank" rel="noreferrer">X <ExternalLink size={13} /></a></div><small>Em celular, “Preparar para Story” abre o compartilhamento do aparelho quando compatível. O Instagram só aparecerá se estiver instalado e disponível nas opções do sistema.</small></section>
      <div className="chart-card"><div className="chart-heading"><div><p className="eyebrow">Ranking completo</p><h3>Percentual de afinidade</h3></div><Pill>{answerCount(answers)} respostas usadas</Pill></div><div className="bar-chart"><ResponsiveContainer width="100%" height={Math.max(420, data.length * 38)}><BarChart layout="vertical" data={data} margin={{ left: 14, right: 36, top: 4, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e6dfd3" /><XAxis type="number" domain={[0, 100]} tick={{ fill: "#687078", fontSize: 12 }} /><YAxis type="category" dataKey="name" width={175} tick={{ fill: "#29333a", fontSize: 11 }} /><Tooltip formatter={(value) => [`${value}%`, "Afinidade"]} cursor={{ fill: "#f3eee5" }} /><Bar dataKey="score" radius={[0, 6, 6, 0]}>{data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></div></div>
      <div className="chart-card radar-card"><div className="chart-heading"><div><p className="eyebrow">Leitura por eixo</p><h3>Radar de afinidade dos três primeiros resultados</h3></div><Pill>percentual por eixo</Pill></div><div className="radar-wrap"><ResponsiveContainer width="100%" height={390}><RadarChart data={radarData}><PolarGrid stroke="#d9d3c8" /><PolarAngleAxis dataKey="axis" tick={{ fill: "#526068", fontSize: 10 }} /><Radar name={getProgramMeta(radarPrograms[0]?.program.program ?? "").name} dataKey="p0" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.16} /><Radar name={getProgramMeta(radarPrograms[1]?.program.program ?? "").name} dataKey="p1" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.1} /><Radar name={getProgramMeta(radarPrograms[2]?.program.program ?? "").name} dataKey="p2" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.1} /><Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} /></RadarChart></ResponsiveContainer></div></div>
      <div className="result-list">{results.map((result, index) => <article className="result-row" key={result.program.program}><div className="rank-number">{String(index + 1).padStart(2, "0")}</div><div className="result-name"><div className="result-heading"><Portraits portraits={getProgramMeta(result.program.program).portraits} compact /><div><h3>{getProgramMeta(result.program.program).name}</h3><p>{getProgramMeta(result.program.program).document} · cobertura {percentage(result.coverage)}</p></div></div><p className="result-brief">{narratives[result.program.program]?.text ?? deterministicNarrative(result, answers)}</p></div><strong className="row-score">{percentage(result.score)}</strong><div className="result-row-actions"><Button variant="outline" size="sm" className="soft-button" disabled={generating === result.program.program} onClick={() => generateNarrative(result)}>{generating === result.program.program ? <Loader2 className="spin" size={14} /> : <Cpu size={14} />} IA local</Button><Button variant="outline" size="sm" className="soft-button" onClick={() => openDetail(result)}>Detalhar <ChevronRight size={15} /></Button></div></article>)}</div>
      <div className="result-actions"><Button className="primary-cta" onClick={() => { setSelectedProgram(results[0]?.program.program ?? null); navigate("detail"); }}>Explorar o primeiro resultado <ArrowRight size={17} /></Button><Button variant="outline" className="soft-button" onClick={() => navigate("method")}>Ver metodologia</Button></div>
    </div>;
  };

  const renderCompass = () => {
    const available = results.filter((result) => result.economic !== null && result.social !== null);
    const positions = available.map((result, index) => ({ ...result, index, left: 50 + ((result.economic ?? 0) / 2) * 43, top: 50 - ((result.social ?? 0) / 2) * 43 }));
    const userAvailable = coordinates.economic !== null && coordinates.social !== null;
    const userLeft = 50 + ((coordinates.economic ?? 0) / 2) * 43;
    const userTop = 50 - ((coordinates.social ?? 0) / 2) * 43;
    return <div className="compass-card"><div className="chart-heading"><div><p className="eyebrow">Visualização auxiliar</p><h3>Mapa econômico × social/liberdades</h3></div><Pill>não altera o ranking</Pill></div><p className="compass-copy">Cada ponto é uma média dos itens previamente designados para os dois eixos. Itens sem posição documental não entram; por isso, nem todo programa pode aparecer no mapa.</p><div className="compass-plot" role="img" aria-label="Mapa bidimensional com programas e posição do usuário"><span className="axis-label top">Mais liberdades / proteção de direitos</span><span className="axis-label bottom">Mais autoridade / restrição</span><span className="axis-label left">Maior atuação estatal</span><span className="axis-label right">Maior orientação de mercado</span>{positions.map((position) => <button onClick={() => openDetail(position)} className="compass-dot" title={getProgramMeta(position.program.program).name} style={{ left: `${position.left}%`, top: `${position.top}%`, background: COLORS[position.index % COLORS.length] }} key={position.program.program}><span className="sr-only">{getProgramMeta(position.program.program).name}</span></button>)}{userAvailable && <div className="user-dot" style={{ left: `${userLeft}%`, top: `${userTop}%` }} title="Sua posição"><span>Você</span></div>}</div><div className="compass-legend">{userAvailable && <span><i className="legend-user" /> Você</span>}{positions.map((position) => <button key={position.program.program} onClick={() => openDetail(position)}><i style={{ background: COLORS[position.index % COLORS.length] }} />{getProgramMeta(position.program.program).name}</button>)}</div></div>;
  };

  const renderDetail = () => {
    if (!selected) return null;
    const meta = getProgramMeta(selected.program.program);
    const rankedAxes = selected.axes.filter((axis) => axis.score !== null).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    const bestAxes = rankedAxes.slice(0, 2).map((axis) => axis.axis);
    const lowAxes = rankedAxes.slice(-2).map((axis) => axis.axis);
    const evidence = selected.program.evidences.filter((item) => [...bestAxes, ...lowAxes].includes(item.axis as Axis)).slice(0, 8);
    const narrative = narratives[selected.program.program];
    return <div className="detail-shell"><button className="back-link" onClick={() => navigate("results")}><ArrowLeft size={16} /> Voltar aos resultados</button><div className="detail-heading"><div><Pill kind="accent">{meta.document}</Pill><Portraits portraits={meta.portraits} /><h2>{meta.name}</h2><p>Percentual de afinidade: <strong>{percentage(selected.score)}</strong> · cobertura: <strong>{percentage(selected.coverage)}</strong></p></div><a className="source-link" href={meta.url} target="_blank" rel="noreferrer"><FileText size={17} /> Abrir PDF original <ExternalLink size={14} /></a></div><Guidance item={journeyGuidance.detail} className="detail-guidance" />
      <div className="detail-grid"><section className="axis-card"><h3>Leitura por eixo</h3>{selected.axes.map((axis) => <div className="axis-score" key={axis.axis}><div><strong>{axis.axis}</strong><span>{axis.score === null ? "Sem comparabilidade" : `afinidade ${percentage(axis.score)} · cobertura ${percentage(axis.coverage)}`}</span></div><div className="mini-track"><span style={{ width: `${(axis.score ?? 0) * 100}%` }} /></div></div>)}</section><section className="narrative-card"><div className="narrative-head"><Sparkles size={18} /><h3>Explicação personalizada</h3></div><p>{narrative?.text ?? deterministicNarrative(selected, answers)}</p>{narrative?.mode === "local-llm" && <Pill kind="success">Gerada localmente no dispositivo</Pill>}{narrative?.reason && <p className="fallback-note">Alternativa determinística: {narrative.reason}</p>}<label className="consent-row"><input type="checkbox" checked={localConsent} onChange={(event) => setLocalConsent(event.target.checked)} /> <span>Autorizo baixar e executar um modelo local neste dispositivo. Nenhuma resposta será enviada ao servidor.</span></label><Button variant="outline" className="soft-button" disabled={generating === selected.program.program} onClick={() => generateNarrative(selected)}>{generating === selected.program.program ? <><Loader2 className="spin" size={16} /> Preparando modelo local</> : <><Cpu size={16} /> Gerar com IA local</>}</Button></section></div>
      <section className="evidence-section"><div className="chart-heading"><div><p className="eyebrow">Rastreabilidade</p><h3>Propostas e trechos citados</h3></div><a className="text-link" href={meta.url} target="_blank" rel="noreferrer">Consultar documento <ExternalLink size={14} /></a></div>{evidence.length ? <div className="evidence-list">{evidence.map((item, index) => <article className="evidence-card" key={`${item.id}-${index}`}><div><Pill>{item.axis}</Pill><span className="page-mark">p. {item.page}</span></div><blockquote>“{item.quote}”</blockquote><p>Atribuição usada para a afirmação <strong>{item.id}</strong>. <a href={meta.url} target="_blank" rel="noreferrer">Ver no PDF <ExternalLink size={12} /></a></p></article>)}</div> : <div className="empty-evidence"><Info size={20} /><p>Não há evidências suficientemente específicas nos eixos comparáveis desta seleção. A ausência não é convertida em posição.</p></div>}<div className="limits-box"><strong>Limites documentais</strong><p>{selected.program.limitations || "O documento não detalha limitações adicionais na matriz disponível."}</p></div></section>{renderCompass()}</div>;
  };

  const renderMethod = () => <div className="method-shell"><SectionTitle eyebrow="Transparência metodológica" title="O resultado é reproduzível, e seus limites são visíveis." text="A ferramenta mede concordância com afirmações do questionário; não mede a qualidade de candidaturas nem substitui a decisão de voto." /><Guidance item={journeyGuidance.method} className="method-guidance" />
    <div className="method-grid"><article><span>01</span><h3>Documentos antes de rótulos</h3><p>As posições são extraídas apenas dos doze programas recebidos. Cada posição atribuída traz uma passagem curta, página e vínculo para o PDF. Omissões permanecem indisponíveis.</p></article><article><span>02</span><h3>Distância explícita</h3><p>Respostas e posições usam a escala de −2 a +2. A afinidade de cada item é <code>1 − |resposta − posição| ÷ 4</code>. A média final pondera seus eixos e só usa itens comparáveis.</p></article><article><span>03</span><h3>Cobertura separada</h3><p>O percentual de cobertura revela quanto das suas respostas pôde ser comparado com posição programática documentada. Não transforma silêncio do documento em concordância, neutralidade ou discordância.</p></article><article><span>04</span><h3>Privacidade por padrão</h3><p>O cálculo ocorre no navegador. Não há envio de respostas, persistência no banco, cookies de rastreamento ou integração com analytics. A IA, quando solicitada, roda no dispositivo.</p></article></div>
    <section className="sources-table"><h3>Fontes e classificação</h3><div className="source-table-head"><span>Fonte</span><span>Uso no produto</span><span>Classificação</span></div><div className="source-table-row"><a href="https://doi.org/10.1007/s10676-024-09790-6" target="_blank" rel="noreferrer">Stockinger et al. (2024) <ExternalLink size={13} /></a><span>Transparência, autonomia, privacidade e auditabilidade de aplicações de afinidade eleitoral.</span><Pill kind="success">Revisada por pares</Pill></div><div className="source-table-row"><a href="https://doi.org/10.1016/j.electstud.2014.11.002" target="_blank" rel="noreferrer">Lefevere, Walgrave & Tresch (2015) <ExternalLink size={13} /></a><span>Risco metodológico da seleção de afirmações.</span><Pill kind="success">Revisada por pares</Pill></div><div className="source-table-row"><a href="https://doi.org/10.1017/psrm.2024.42" target="_blank" rel="noreferrer">Elkjær & Iversen (2025) <ExternalLink size={13} /></a><span>Tratamento de “não sei” em itens de preferência política.</span><Pill kind="success">Revisada por pares</Pill></div><div className="source-table-row"><a href="https://www.ibge.gov.br/indicadores" target="_blank" rel="noreferrer">IBGE · Painel de Indicadores <ExternalLink size={13} /></a><span>Contexto oficial; não entra na pontuação.</span><Pill>Base pública</Pill></div><div className="source-table-row"><span>{contextualSourcePolicy.title}</span><span>{contextualSourcePolicy.exclusion}</span><Pill>Contextual, não revisada por pares</Pill></div></section>
    <section className="programs-section"><div className="chart-heading"><div><p className="eyebrow">Base documental</p><h3>Programas analisados</h3></div><Pill>{programs.length} documentos</Pill></div><ProgramCatalog /></section><div className="stage-actions"><Button variant="outline" className="soft-button" onClick={() => navigate("intro")}><ArrowLeft size={16} /> Voltar</Button><Button className="primary-cta" onClick={() => navigate("weights")}>Fazer o questionário <ArrowRight size={17} /></Button></div></div>;

  return <main className="site-shell"><header className="topbar"><button className="brand" onClick={() => navigate("intro")} aria-label="Ir para introdução"><span className="brand-mark">B</span><span>Brasil <b>em perspectiva</b></span></button><nav aria-label="Navegação principal"><button onClick={() => navigate("intro")}>Início</button><button onClick={() => navigate("method")}>Método</button>{screen === "results" || screen === "detail" ? <button onClick={() => navigate("results")}>Resultados</button> : <button onClick={() => navigate("weights")}>Questionário</button>}</nav><button className="quiet-reset" onClick={reset} title="Recomeçar e apagar respostas"><RotateCcw size={15} /> Recomeçar</button></header><div className="site-content">{screen === "intro" && renderIntro()}{screen === "weights" && renderWeights()}{screen === "quiz" && renderQuiz()}{screen === "results" && renderResults()}{screen === "detail" && renderDetail()}{screen === "method" && renderMethod()}</div><footer><span>Brasil em perspectiva · comparação programática</span><span>Respostas não são armazenadas. Versão documental: 17 ago. 2026.</span></footer></main>;
}
