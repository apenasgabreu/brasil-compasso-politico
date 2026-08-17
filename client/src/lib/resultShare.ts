export type ShareResult = { candidate: string; score: number | null; coverage: number | null; url: string; portraitUrl?: string; document?: string; party?: string; sourceUrl?: string };

const percent = (value: number | null) => value === null ? "não calculada" : `${Math.round(value * 100)}%`;

export function buildShareText(result: ShareResult) {
  return `No Brasil em Perspectiva, minha maior afinidade programática documentada foi com ${result.candidate}: ${percent(result.score)}. Cobertura documental: ${percent(result.coverage)}. É uma comparação de propostas, não recomendação de voto.`;
}

export function buildStoryOrigin(result: ShareResult) {
  const document = result.document ? ` Programa analisado: ${result.document}.` : "";
  return `Resultado calculado localmente a partir das respostas do eleitor comparadas às posições documentadas no programa eleitoral.${document}`;
}

export function buildStorySource(result: ShareResult) {
  return result.sourceUrl ? "Escaneie o QR code para abrir diretamente o PDF do programa analisado." : "Fonte direta do programa disponível na página de resultados.";
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

async function loadPortrait(source: string) {
  const response = await fetch(source);
  if (!response.ok) throw new Error("Não foi possível carregar o retrato para o card.");
  const objectUrl = URL.createObjectURL(await response.blob());
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(objectUrl); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Não foi possível carregar o retrato para o card.")); };
    image.src = objectUrl;
  });
}

function loadInlineImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível preparar o QR code."));
    image.src = source;
  });
}

function drawPortrait(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  const size = 250; const x = 738; const y = 176;
  const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
  const width = image.naturalWidth * scale; const height = image.naturalHeight * scale;
  ctx.save(); ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(image, x + (size - width) / 2, y + (size - height) / 2, width, height); ctx.restore();
  ctx.strokeStyle = "rgba(248,243,234,.88)"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2 - 4, 0, Math.PI * 2); ctx.stroke();
}

async function drawSourceQr(ctx: CanvasRenderingContext2D, sourceUrl: string) {
  const QRCode = await import("qrcode");
  const dataUrl = await QRCode.toDataURL(sourceUrl, { width: 190, margin: 1, color: { dark: "#17394b", light: "#f8f3ea" } });
  const image = await loadInlineImage(dataUrl);
  ctx.fillStyle = "#f8f3ea"; ctx.fillRect(774, 1606, 202, 202); ctx.drawImage(image, 780, 1612, 190, 190);
}

export async function createStoryCard(result: ShareResult) {
  const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1920;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Não foi possível preparar o card.");
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920); gradient.addColorStop(0, "#17394b"); gradient.addColorStop(1, "#9f4b2d"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.fillRect(88, 128, 904, 4);
  ctx.fillStyle = "#f8f3ea"; ctx.font = "600 38px Arial"; ctx.fillText("BRASIL EM PERSPECTIVA", 92, 220);
  if (result.portraitUrl) { try { drawPortrait(ctx, await loadPortrait(result.portraitUrl)); } catch { /* O card permanece válido mesmo se a imagem não carregar. */ } }
  ctx.font = "400 62px Georgia"; const heading = "Minha maior afinidade programática documentada"; let y = 470; wrap(ctx, heading, 860).forEach((line) => { ctx.fillText(line, 92, y); y += 78; });
  ctx.fillStyle = "#ffd7b7"; ctx.font = "700 78px Georgia"; y += 64; wrap(ctx, result.candidate, 860).forEach((line) => { ctx.fillText(line, 92, y); y += 92; });
  if (result.party) { ctx.fillStyle = "rgba(248,243,234,.9)"; ctx.font = "600 32px Arial"; y += 14; ctx.fillText(`Partido/coligação: ${result.party}`, 96, y); }
  ctx.fillStyle = "#f8f3ea"; ctx.font = "700 190px Georgia"; ctx.fillText(percent(result.score), 92, 1140);
  ctx.font = "400 38px Arial"; ctx.fillText(`Cobertura documental: ${percent(result.coverage)}`, 96, 1215);
  ctx.fillStyle = "rgba(248,243,234,.9)"; ctx.font = "600 28px Arial"; y = 1360; wrap(ctx, "DE ONDE VEM ESTE RESULTADO", 860).forEach((line) => { ctx.fillText(line, 92, y); y += 38; });
  ctx.fillStyle = "rgba(248,243,234,.86)"; ctx.font = "400 29px Arial"; y += 20; wrap(ctx, buildStoryOrigin(result), 860).forEach((line) => { ctx.fillText(line, 92, y); y += 40; });
  ctx.fillStyle = "rgba(248,243,234,.9)"; ctx.font = "600 25px Arial"; y += 18; wrap(ctx, "FONTE DOCUMENTAL", 620).forEach((line) => { ctx.fillText(line, 92, y); y += 34; });
  ctx.fillStyle = "rgba(248,243,234,.78)"; ctx.font = "400 25px Arial"; y += 12; wrap(ctx, buildStorySource(result), 620).forEach((line) => { ctx.fillText(line, 92, y); y += 34; });
  if (result.sourceUrl) { try { await drawSourceQr(ctx, result.sourceUrl); } catch { /* A referência textual permanece disponível se o QR falhar. */ } }
  ctx.fillStyle = "rgba(248,243,234,.78)"; ctx.font = "400 25px Arial"; ctx.fillText("Comparação de propostas, não recomendação de voto.", 92, 1870);
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
