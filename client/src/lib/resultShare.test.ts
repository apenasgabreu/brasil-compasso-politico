import { afterEach, describe, expect, it, vi } from "vitest";
import { buildShareText, buildStoryOrigin, buildStorySource, copyShareText, shareNativeResult, shareStory, socialLink } from "./resultShare";

const result = { candidate: "Clariana Barão — Democracia Cristã", score: 0.68, coverage: 0.4, url: "https://exemplo.test" };

describe("resumo compartilhável", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("inclui somente o resumo que o eleitor escolhe compartilhar", () => {
    const text = buildShareText(result);
    expect(text).toContain("Clariana Barão — Democracia Cristã");
    expect(text).toContain("68%");
    expect(text).toContain("não recomendação de voto");
  });

  it("explicita a origem metodológica do card sem expor respostas individuais", () => {
    const origin = buildStoryOrigin({ ...result, document: "Programa de Governo" });
    expect(origin).toContain("respostas do eleitor");
    expect(origin).toContain("posições documentadas");
    expect(origin).toContain("Programa de Governo");
    expect(origin).not.toContain("ECO-01");
  });

  it("inclui partido e referência direta ao programa sem acrescentar respostas", () => {
    const source = buildStorySource({ ...result, party: "Democracia Cristã", sourceUrl: "https://exemplo.test/programa.pdf" });
    expect(source).toContain("QR code");
    expect(source).toContain("PDF");
    expect(source).not.toContain("ECO-01");
  });

  it("monta links codificados para redes sem incluir respostas individuais", () => {
    expect(socialLink("x", result)).toContain("twitter.com/intent/tweet");
    expect(socialLink("whatsapp", result)).toContain("api.whatsapp.com/send");
    expect(socialLink("x", result)).not.toContain("ECO-01");
  });

  it("copia somente o resumo quando a área de transferência está disponível e falha de forma explícita quando não está", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await copyShareText(result);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Clariana Barão"));
    vi.stubGlobal("navigator", {});
    await expect(copyShareText(result)).rejects.toThrow("Cópia não suportada");
  });

  it("faz download local do card de Story quando o compartilhamento de arquivos não é suportado", async () => {
    const click = vi.fn();
    const link = { href: "", download: "", click };
    const context = { createLinearGradient: () => ({ addColorStop: vi.fn() }), fillRect: vi.fn(), fillText: vi.fn(), measureText: () => ({ width: 42 }), fillStyle: "", font: "" };
    const canvas = { width: 0, height: 0, getContext: () => context, toBlob: (callback: (blob: Blob) => void) => callback(new Blob(["card"], { type: "image/png" })) };
    vi.stubGlobal("document", { createElement: vi.fn((tag: string) => tag === "canvas" ? canvas : link) });
    vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:story"), revokeObjectURL: vi.fn() });
    vi.stubGlobal("navigator", {});
    await expect(shareNativeResult(result)).rejects.toThrow("Compartilhamento nativo indisponível");
    await expect(shareStory(result)).resolves.toBe("downloaded");
    expect(click).toHaveBeenCalledOnce();
  });
});
