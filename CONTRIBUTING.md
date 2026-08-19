# Como contribuir

Obrigado por contribuir com o **Brasil em Perspectiva**. O projeto lida com comparação política e, por isso, alterações de conteúdo exigem um padrão de revisão mais alto que mudanças puramente visuais.

## Princípios de contribuição

Toda contribuição deve preservar neutralidade metodológica, transparência documental, privacidade por padrão, acessibilidade e linguagem não direcionadora. Não adicione depoimentos, avaliações, rankings externos, dados pessoais, rastreadores ou posições inferidas fora dos documentos analisados.

| Tipo de mudança | Requisito mínimo |
|---|---|
| Pergunta ou eixo | Atualizar matriz, evidência, documentação e testes de cálculo quando aplicável. |
| Posição de programa | Incluir citação direta, página, documento de origem e nível de confiança. |
| Interface | Preservar foco por teclado, contraste, texto alternativo e comportamento móvel. |
| Segurança ou privacidade | Atualizar `SECURITY.md`, testes e documentação de limites. |
| Dependência | Justificar necessidade, impacto de bundle, licença e implicações de privacidade. |

## Fluxo sugerido

1. Abra uma issue descrevendo o problema ou a proposta, quando possível.
2. Crie uma branch com escopo pequeno e nome descritivo.
3. Faça a alteração e mantenha `todo.md` atualizado quando estiver trabalhando no ambiente Manus.
4. Execute `pnpm test`, `pnpm check` e `pnpm build`.
5. Descreva evidências, limitações e impacto metodológico no pull request.

Não inclua códigos de recuperação, respostas de participantes, `.env` ou tokens em commits, issues ou comentários.
