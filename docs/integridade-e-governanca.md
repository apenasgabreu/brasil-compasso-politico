# Integridade metodológica e governança pública

## Objetivo

Este documento descreve como o projeto reduz o risco de que colaboradores, usuários ou mudanças não revisadas alterem artificialmente a comparação para favorecer ou prejudicar uma candidatura. Nenhuma medida elimina o risco de uma pessoa com controle administrativo total agir de má-fé; por isso, a proteção é em camadas: código verificável, CI, revisão, evidência documental, integridade da matriz e transparência pública.

## Modelo de ameaça e resposta

| Ameaça | Controle adotado | Limite explícito |
|---|---|---|
| Um usuário tenta elevar o próprio resultado ou o de outra pessoa. | A afinidade é calculada no navegador a partir de respostas, pesos e matriz versionada; não existe ranking coletivo, voto, contador de preferência ou endpoint que aceite pontuações. | A pessoa pode alterar suas próprias respostas locais, mas isso não muda a matriz nem resultados de terceiros. |
| Um código de recuperação é usado para influenciar a matriz. | O cofre persistente contém apenas um snapshot cifrado de resultado; o servidor não decifra, agrega ou reutiliza seu conteúdo no cálculo programático. | Quem possuir o código consegue abrir aquele snapshot, como descrito na política de privacidade. |
| Um pull request altera perguntas, posições ou pesos sem evidência. | Mudanças na matriz exigem citação, página, documento, versão, teste de integridade e revisão metodológica conforme `GOVERNANCE.md`. | Uma pessoa com permissão administrativa ainda pode agir fora do processo; o histórico público permite auditoria posterior. |
| Um pull request quebra cálculo, interface ou privacidade. | CI executa testes, tipagem, build, verificação de matriz e varredura de segredos. A proteção de `main` exige pull request, checks e conversas resolvidas. | Checks não substituem revisão humana de mudanças metodológicas. |
| Workflow de CI é explorado por contribuição não confiável. | O workflow usa `pull_request`, permissões mínimas de leitura e não acessa segredos. Não usa `pull_request_target`; ações são fixadas em SHAs completos. [3] | Código de PR ainda é executado em ambiente efêmero, portanto nenhum segredo é disponibilizado. |
| Uma alteração opaca tenta reescrever o histórico da matriz. | O manifesto fixa hashes SHA-256 dos dados e fontes de versão; o CI falha se o manifesto não for atualizado conscientemente. Proteção de branch impede force-push e exclusão. [1] [2] | O hash confirma alteração, não determina se a decisão metodológica foi correta. |
| Um ator tenta ocupar o armazenamento de cofres cifrados. | O endpoint aceita somente envelopes limitados, valida formato, expira em 365 dias e remove registros vencidos. | Uma limitação de taxa global exige infraestrutura compartilhada; o projeto registra isso como melhoria futura, não como garantia existente. |

## Princípios inegociáveis

> Não há mecanismo de participação, compartilhamento, recuperação ou contribuição que possa recalcular, agregar ou popularizar resultados para favorecer uma candidatura.

As posições programáticas só podem ser alteradas por arquivos versionados. Todo resultado exibe a versão e a impressão digital da matriz de que deriva. A recuperação cifrada restaura uma fotografia de um resultado anterior; ela não consulta tendências, não altera a base documental e não cria uma estatística pública.

## Proteções recomendadas para `main`

O repositório aplica, quando disponível, pull request obrigatório, check de CI obrigatório, conversas resolvidas, bloqueio de force-push e bloqueio de exclusão da branch. O GitHub documenta que checks obrigatórios devem passar antes da alteração de branch protegida e que revisões, resolução de conversas e restrições adicionais podem ser exigidas. [1] [2]

O arquivo `CODEOWNERS` define responsáveis pelos arquivos metodológicos, pela matriz, pelo cálculo e pelos workflows. Exigir aprovação de Code Owners deve ser ativado depois que houver pelo menos uma segunda pessoa revisora independente com acesso adequado; em um repositório de mantenedor único, essa regra pode impedir merges legítimos sem acrescentar independência real.

## Regras para mudanças metodológicas

Uma alteração em pergunta, posição, peso, normalização, cobertura, texto de evidência ou fonte deve incluir: justificativa pública; trecho documental; página; versão do documento; impacto esperado; atualização de hash; e revisão por alguém que não tenha proposto a alteração, quando houver segunda pessoa revisora. O guia completo está em `GOVERNANCE.md`.

## Referências

[1] [GitHub Docs, *About protected branches*](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)

[2] [GitHub Docs, *Managing a branch protection rule*](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)

[3] [GitHub Docs, *Secure use reference for GitHub Actions*](https://docs.github.com/en/actions/reference/security/secure-use)

## Estado configurado

Em 19 de agosto de 2026, o workflow `quality-and-integrity` concluiu com sucesso a verificação de manifesto, a suíte de testes, a tipagem e o build. A branch `main` passou a exigir esse check atualizado, exige que a branch esteja em dia antes do merge, aplica as regras também a administradores, exige conversas resolvidas e bloqueia force-push e exclusão. Aprovação obrigatória de Code Owner permanece desativada enquanto houver apenas uma pessoa mantenedora; essa escolha evita uma falsa sensação de revisão independente e está documentada para reavaliação quando houver segunda pessoa revisora.
