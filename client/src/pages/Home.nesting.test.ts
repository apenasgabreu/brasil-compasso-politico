import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProgramCatalog } from "./Home";

describe("catálogo de programas", () => {
  it("não renderiza âncoras dentro dos links externos dos documentos", () => {
    const markup = renderToStaticMarkup(createElement(ProgramCatalog));
    expect(markup).not.toMatch(/<a\b[^>]*>(?:(?!<\/?a\b)[\s\S])*<a\b/);
    expect((markup.match(/<a\b/g) ?? [])).toHaveLength(12);
  });
});
