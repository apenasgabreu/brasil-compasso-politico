# Dupla codificação independente

Este diretório inicia a segunda etapa de codificação documental da matriz. A folha `reviewer-2-blind-template.json` é gerada com **600 células** — 12 programas × 50 afirmações — e não contém posições, níveis de confiança, páginas ou citações do primeiro codificador. Ela permite uma revisão integral, não apenas uma amostra.

> O segundo codificador deve ser uma pessoa que não participou da codificação inicial e não deve consultar a matriz, os resultados do produto nem as evidências já extraídas antes de entregar sua folha preenchida.

| Etapa | Responsável | Evidência gerada |
| --- | --- | --- |
| Confirmar os hashes dos 12 PDFs | Segundo codificador | Registro de conferência no arquivo de resposta. |
| Codificar posição, confiança, página e citação | Segundo codificador | Cópia preenchida da folha cega. |
| Comparar decisões sem apagar a divergência | Mantenedor metodológico | `agreement-report.json` e `reconciliation-log.json`. |
| Resolver divergências com justificativa | Dois codificadores e revisor de governança | Log de reconciliação com decisão, fonte e impacto. |
| Alterar a matriz somente após governança | Mantenedor + revisão | Changelog, manifesto SHA-256 e CI. |

## Como preparar a folha

```bash
pnpm review:prepare
```

Envie somente `reviewer-2-blind-template.json` ao segundo codificador. A pessoa deve preencher `reviewerId`, `reviewedAt` e cada campo `reviewer2*`, trocar `status` para `complete` e devolver uma cópia renomeada. Os campos de posição aceitam `-2`, `-1`, `0`, `1`, `2` ou `null`; confiança aceita `0.8`, `0.9` ou `null`.

## Como calcular a concordância

```bash
pnpm review:analyze caminho/para/resposta-do-segundo-codificador.json
```

O relatório separa duas decisões. Primeiro, mede se ambos encontraram ou não uma posição documental na célula, por acordo simples e **kappa de Cohen**. Depois, mede a intensidade/direção somente nas células em que ambos encontraram posição, por acordo exato e **alfa ordinal de Krippendorff**. Essa separação evita fingir que silêncio documental é uma escala ideológica.

Não publique uma métrica de confiabilidade como resultado final até verificar independência, preservar a folha original do segundo codificador e concluir todas as divergências no log de reconciliação.

## Referências metodológicas

- Krippendorff, K. *Content Analysis: An Introduction to Its Methodology*, 4. ed., 2019.
- `docs/codebook-codificacao.md` — escala, confiança, unidade de codificação e regras de revisão.
- `shared/source-document-integrity.json` — hashes, pacote preservado e catálogo oficial dos documentos.
