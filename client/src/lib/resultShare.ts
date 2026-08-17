export type ShareResult = { candidate: string; score: number | null; coverage: number | null; url: string };

const percent = (value: number | null) => value === null ? "não calculada" : `${Math.round(value * 100)}%`;

export function buildShareText(result: ShareResult) {
  return `No Brasil em Perspectiva, minha maior afinidade programática documentada foi com ${result.candidate}: ${percent(result.score)}. Cobertura documental: ${percent(result.coverage)}. É uma comparação de propostas, não recomendação de voto.`;
}

export function socialLink(network: "x" | "whatsapp", result: ShareResult) {
  const text = encodeURIComponent(`${buildShareText(result)} ${result.url}`);
  return network === "x" ? `https://twitter.com/intent/tweet?text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
}

export function supportsNativeShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function copyShareText(result: ShareResult) {
  if (!navigator.clipboard?.writeText) throw new Error("Cópia não suportada neste navegador.");
  await navigator.clipboard.writeText(`${buildShareText(result)}\n${result.url}`);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" "); const lines: string[] = []; let current = "";
  words.forEach((word) => { const next = current ? `${current} ${word}` : word; if (ctx.measureText(next).width > maxWidth && current) { lines.push(current); current = word; } else current = next; });
  if (current) lines.push(current); return lines;
}

export async function createStoryCard(result: ShareResult) {
  const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1920;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Não foi possível preparar o card.");
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920); gradient.addColorStop(0, "#17394b"); gradient.addColorStop(1, "#9f4b2d"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.fillRect(88, 128, 904, 4);
  ctx.fillStyle = "#f8f3ea"; ctx.font = "600 38px Arial"; ctx.fillText("BRASIL EM PERSPECTIVA", 92, 220);
  ctx.font = "400 68px Georgia"; const heading = "Minha maior afinidade programática documentada"; let y = 410; wrap(ctx, heading, 860).forEach((line) => { ctx.fillText(line, 92, y); y += 88; });
  ctx.fillStyle = "#ffd7b7"; ctx.font = "700 98px Georgia"; y += 85; wrap(ctx, result.candidate, 860).forEach((line) => { ctx.fillText(line, 92, y); y += 112; });
  ctx.fillStyle = "#f8f3ea"; ctx.font = "700 220px Georgia"; ctx.fillText(percent(result.score), 92, 1240);
  ctx.font = "400 42px Arial"; ctx.fillText(`Cobertura documental: ${percent(result.coverage)}`, 96, 1330);
  ctx.fillStyle = "rgba(248,243,234,.86)"; ctx.font = "400 38px Arial"; y = 1540; wrap(ctx, "Comparação de propostas documentadas. Não é recomendação de voto.", 860).forEach((line) => { ctx.fillText(line, 92, y); y += 52; });
  ctx.fillStyle = "rgba(248,243,234,.78)"; ctx.font = "400 30px Arial"; ctx.fillText("Compartilhado voluntariamente pelo eleitor.", 92, 1770);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Não foi possível gerar a imagem.");
  return new File([blob], "meu-resultado-brasil-em-perspectiva.png", { type: "image/png" });
}

export async function shareNativeResult(result: ShareResult) {
  if (!supportsNativeShare()) throw new Error("Compartilhamento nativo indisponível neste navegador.");
  await navigator.share({ title: "Brasil em Perspectiva", text: buildShareText(result), url: result.url });
}

export async function shareStory(result: ShareResult) {
  const file = await createStoryCard(result);
  const payload = { title: "Meu resultado · Brasil em Perspectiva", text: "Comparação programática, não recomendação de voto.", files: [file] };
  if (supportsNativeShare() && (!navigator.canShare || navigator.canShare(payload))) { await navigator.share(payload); return "shared" as const; }
  const objectUrl = URL.createObjectURL(file); const link = document.createElement("a"); link.href = objectUrl; link.download = file.name; link.click(); URL.revokeObjectURL(objectUrl); return "downloaded" as const;
}
