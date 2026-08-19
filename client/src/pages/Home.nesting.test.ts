import { createElement } from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { journeyGuidance, ProgramCatalog } from "./Home";
import { matrixIntegrity, methodologyChangelog } from "@/data/compassData";

describe("catálogo de programas", () => {
  it("não renderiza âncoras dentro dos links externos dos documentos", () => {
    const markup = renderToStaticMarkup(createElement(ProgramCatalog));
    expect(markup).not.toMatch(/<a\b[^>]*>(?:(?!<\/?a\b)[\s\S])*<a\b/);
    expect((markup.match(/<a\b/g) ?? [])).toHaveLength(12);
  });

  it("mantém retratos estáticos compactos, circulares e responsivos", () => {
    const markup = renderToStaticMarkup(createElement(ProgramCatalog));
    const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");

    expect((markup.match(/class="portrait-static"/g) ?? [])).toHaveLength(12);
    expect((markup.match(/alt="Retrato de [^"]+"/g) ?? [])).toHaveLength(12);
    expect(css).toContain(".portrait-stack a, .portrait-static");
    expect(css).toContain("width: 58px; height: 58px");
    expect(css).toContain("border-radius: 50%");
    expect(css).toContain("object-fit: cover");
    expect(css).toContain(".portrait-stack-compact a, .portrait-stack-compact .portrait-static");
    expect(css).toContain("@media (max-width: 850px) { .hero-grid, .result-feature, .detail-grid");
    expect(css).toContain(".program-catalog { grid-template-columns: 1fr; }");
  });

  it("preserva os apoios de compreensão e os fluxos essenciais da jornada", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

    expect(Object.keys(journeyGuidance)).toEqual(["intro", "weights", "quiz", "results", "detail", "method"]);
    expect(journeyGuidance.quiz.title).toContain("Não é uma prova");
    expect(journeyGuidance.results.text).toContain("Nenhum dos dois números é uma nota");
    ["Começar com privacidade", "Ir ao questionário", "Ver resultados", "Ler evidências", "Preparar para Story", "Fazer o questionário"].forEach((label) => expect(source).toContain(label));
  });

  it("mantém avisos semânticos, responsivos e sem armazenamento ou envio de respostas", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
    const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");

    expect(source).toContain('role="note"');
    expect((source.match(/<Guidance item=/g) ?? [])).toHaveLength(6);
    expect(source).not.toMatch(/localStorage|sessionStorage|document\.cookie|fetch\(/);
    expect(css).toContain(".guidance-note");
    expect(css).toContain("@media (max-width: 600px)");
  });

  it("não mantém dependências, controles ou textos de IA local", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
    const packageJson = readFileSync(new URL("../../../package.json", import.meta.url), "utf8");

    expect(source).not.toMatch(/localNarrative|Gerar com IA|IA local|modelo local/);
    expect(packageJson).not.toContain("@mlc-ai/web-llm");
  });

  it("publica changelog metodológico versionado e vinculado à integridade da matriz", () => {
    const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
    const css = readFileSync(new URL("../integrity.css", import.meta.url), "utf8");

    expect(methodologyChangelog.length).toBeGreaterThanOrEqual(3);
    expect(new Set(methodologyChangelog.map((entry) => entry.version)).size).toBe(methodologyChangelog.length);
    methodologyChangelog.forEach((entry) => {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.scope).not.toHaveLength(0);
      expect(entry.impact).not.toHaveLength(0);
      expect(entry.referenceUrl).toMatch(/^https:\/\//);
    });
    expect(matrixIntegrity.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(matrixIntegrity.files).toHaveProperty("shared/methodology-changelog.json");
    expect(source).toContain("Changelog metodológico");
    expect(source).toContain("methodologyChangelog.map");
    expect(css).toContain(".methodology-changelog");
  });
});
