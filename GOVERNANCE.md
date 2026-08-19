# Governança de revisões metodológicas

## Finalidade

Este projeto compara respostas individuais a propostas documentadas. Ele não mede intenção de voto, popularidade, aprovação social ou “qualidade” de candidatura. A governança existe para preservar a rastreabilidade de cada posição, impedir alterações direcionadas a resultados e tornar conflitos de interesse visíveis.

## Escopo de revisão

| Classe de mudança | Exemplos | Exigência mínima |
|---|---|---|
| Documental | Autoria, URL, página, citação, foto ou metadado. | Fonte primária verificável e revisão de mantenedor. |
| Interpretativa | Posição de programa, confiança, cobertura ou limitação. | Citação literal, página, justificativa e revisão metodológica. |
| Estrutural | Pergunta, eixo, peso, normalização, algoritmo ou matriz. | Justificativa pública, testes, atualização do manifesto e revisão independente quando disponível. |
| Segurança e privacidade | Cofres, recuperação, dados, dependências ou permissões. | Relato responsável, teste e revisão de segurança. |

## Processo de mudança

Toda proposta começa em issue ou pull request com motivação, escopo, evidência e impacto esperado. Para mudanças interpretativas e estruturais, a proposta deve indicar o documento, a página, o trecho relevante, a versão da matriz afetada e por que a alteração não transforma silêncio documental em posição. A discussão deve separar fato documental, decisão metodológica e preferência política.

O CI precisa passar e o manifesto de integridade precisa ser atualizado conscientemente quando arquivos protegidos mudarem. O histórico público deve conter a razão da mudança. Correções urgentes de erro factual podem ser aplicadas mais rapidamente, mas permanecem sujeitas a revisão posterior e registro público.

## Independência e conflitos de interesse

Pessoas que tenham vínculo de campanha, partido, candidatura, consultoria política, financiamento ou atividade de advocacia relacionada devem declarar o vínculo no issue ou pull request. Ter vínculo não invalida uma evidência documental, mas impede que a própria pessoa seja a única revisora de uma alteração que beneficie diretamente a parte vinculada.

Quando houver mais de uma pessoa mantenedora, mudanças estruturais exigem aprovação de alguém que não as tenha proposto. Enquanto o repositório tiver apenas uma pessoa mantenedora, esta limitação será exibida publicamente e a mudança poderá ser auditada pelo histórico, pelo manifesto e pelas evidências, mas não será considerada revisão independente.

## Regras de integridade

Não são aceitas propostas que busquem elevar ou reduzir a afinidade de candidatura sem justificativa documental. Não há votação de usuários, contagem de compartilhamentos, feedback de resultados ou dados de cofres que possam influenciar a matriz. A recuperação por código restaura apenas um snapshot cifrado do próprio eleitor.

Alterações em `shared/compassPositions.json`, `client/src/data/compassData.ts` ou `client/src/lib/scoring.ts` exigem atualização do manifesto de integridade, testes e registro de impacto. Uma mudança de hash é um aviso público de que a matriz, pergunta ou cálculo mudou; não é, por si só, uma certificação de correção.

## Revisão e recurso

Qualquer pessoa pode contestar uma alteração abrindo issue documental. A resposta deve referenciar fontes e registrar se a contestação foi acolhida, parcialmente acolhida ou rejeitada. Questões de segurança devem seguir `SECURITY.md`; não publique códigos de recuperação ou respostas individuais.

## Aplicação prática

Este guia não substitui supervisão eleitoral, jurídica ou científica externa. Ele estabelece um processo público, verificável e proporcional para uma ferramenta de comparação programática.
