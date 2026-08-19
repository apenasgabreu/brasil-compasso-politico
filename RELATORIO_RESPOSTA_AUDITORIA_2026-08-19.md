# Relatório de resposta à auditoria externa

**Projeto:** Brasil em Perspectiva  
**Data:** 19 de agosto de 2026  
**Escopo:** resposta técnica, metodológica, documental e de publicação ao relatório externo encaminhado pelo responsável do projeto.

> **Síntese.** As correções classificadas como críticas ou de alto impacto foram implementadas e publicadas. A versão principal no GitHub é o merge commit `f4e2918`, resultante do PR #11, após o CI obrigatório com êxito. O deploy de produção está disponível em `https://brasilcpol-fqgbdhtx.manus.space`, inclusive na rota direta `/metodo`. A validação local final registrou 29 testes aprovados, checagem de tipos, build e verificação do manifesto SHA-256. [1] [2] [3] [4]

## 1. Estado de publicação

| Superfície | Estado confirmado | Evidência |
| --- | --- | --- |
| Branch principal no GitHub | **Publicada** no merge commit `f4e2918aa69f8db3513205808934ca601fcc64dd`. | [Commit principal][1] |
| Correções amplas da auditoria | **Integradas** pelo PR #10, após CI obrigatório. | [PR #10][5] |
| Correção do rodapé de proveniência | **Integrada** pelo PR #11, após CI obrigatório. | [PR #11][2] |
| CI final | **Concluído com sucesso** no workflow `Quality and integrity`. | [Execução do CI][3] |
| Deploy de produção | **Ativo** no domínio público; `/metodo` carrega diretamente e exibe matriz, fontes, arquivo permanente e referência pública à branch principal. | [Produção][4] |
| Preservação documental | **Publicada** no Internet Archive como pacote com 12 PDFs e inventários. | [Arquivo permanente][6] |

O primeiro checkpoint local das correções havia publicado o deploy, mas ainda não constava na `main` pública. Essa divergência foi identificada nesta revisão, corrigida por PR protegido e confirmada com o CI remoto. Portanto, a resposta definitiva é: **sim, as mudanças estão tanto no deploy quanto no GitHub**. O ajuste adicional do rodapé também foi publicado posteriormente, e a produção agora exibe “branch principal pública” em vez de `unavailable` quando o ambiente de hospedagem não fornece SHA de commit.

## 2. Resposta aos defeitos críticos de cálculo e apresentação

| Achado do relatório externo | Resposta implementada | Estado e evidência |
| --- | --- | --- |
| Cobertura global calculada como média simples de eixos, punindo quem não respondeu alguns temas. | `scoring.ts` passou a calcular cobertura global por **itens efetivamente comparados ÷ itens respondidos**. Eixos sem resposta são excluídos do denominador. | **Corrigido.** Testes de regressão verificam cobertura global e tratamento de eixos não respondidos. [7] |
| Ranking ordenava somente por afinidade, mesmo quando havia pouca evidência documental. | O resultado separa explicitamente programas com comparabilidade insuficiente do ranking principal. A interface informa que resultados com menos de oito comparações ou cobertura abaixo de 40% não devem ser lidos como posições equivalentes no ranking. | **Corrigido.** Regra implementada no scoring, renderização e documentação metodológica. [7] [8] |
| Coordenadas do mapa dividiam pelo número de valores, não pela soma dos pesos absolutos; não havia sinalização de amostra pequena. | `coordinate()` foi normalizada por `Σ|fator|`; dimensões sem comparações suficientes ficam ausentes em vez de sugerir precisão que não existe. | **Corrigido.** Cobertura por dimensão e supressão explícita são tratadas no cálculo e nos resultados. [7] |

A mudança preserva a distinção central entre **afinidade** e **cobertura**: ausência de posição documentada continua não sendo tratada como posição política. O que mudou foi a apresentação: uma afinidade calculada sobre poucas comparações não recebe mais o mesmo destaque de um resultado comparável.

## 3. Honestidade documental, IA local e cadeia de evidências

| Achado | Resposta implementada | Estado e limites |
| --- | --- | --- |
| Documentação ainda descrevia uma IA local via WebGPU que já não existia no código. | Foram reconciliados `docs/decisoes-produto.md`, `docs/validacao-final.md`, README e o changelog. A aplicação mantém apenas a narrativa determinística ancorada nas respostas e nas evidências. | **Corrigido.** A remoção é registrada no changelog metodológico; registros históricos foram contextualizados, em vez de apresentados como recurso atual. [8] [9] |
| PDFs estavam apenas em armazenamento de entrega e não tinham hashes auditáveis. | Criado `shared/source-document-integrity.json`, com SHA-256 individual, URL de entrega, estado de preservação e catálogo eleitoral oficial. O arquivo entrou no conjunto protegido pelo manifesto de matriz. | **Corrigido.** O manifesto passou a proteger seis fontes metodológicas, incluindo o inventário de documentos e o registro eleitoral. [10] [11] |
| Não havia preservação permanente independente. | Os 12 PDFs e inventários foram reunidos e publicados no item permanente `brasil-em-perspectiva-documentos-2026` do Internet Archive; o pacote contém 14 arquivos e preserva as referências de hash. | **Corrigido.** O arquivo permanente complementa, mas não substitui, a fonte oficial eleitoral. [6] [12] |
| Deploy não era vinculável ao repositório público. | Foi criado `buildProvenance.ts`, a matriz e seu fingerprint aparecem no produto, e o rodapé aponta para o commit quando o SHA é injetado; sem SHA, aponta de modo explícito para a branch principal pública, sem inventar um hash. | **Parcialmente corrigido.** A referência pública e o fingerprint estão no produto; atestações SLSA/GitHub Artifact Attestations ainda não foram configuradas. [4] [13] |

O fingerprint atual da matriz é **`680cc2f743b71a27…`** e sua versão é **`2026.08.19.3`**. A rota pública de método permite verificar esse dado sem concluir o questionário. [4] [11]

## 4. Superfície de ataque, cofre cifrado e privacidade

| Achado | Resposta implementada | Estado e limites |
| --- | --- | --- |
| Template mantinha rotas e superfícies públicas não utilizadas. | Rotas públicas herdadas de autenticação, armazenamento e sistema foram removidas do roteador exposto. O gancho de autenticação ficou inerte, sem sessão, cookie ou chamada de conta. | **Parcialmente corrigido.** A superfície exposta diminuiu; módulos internos de template ainda existem no repositório e podem ser removidos em uma refatoração estrutural futura. [14] |
| Limite JSON de 50 MB era inadequado. | O servidor recebeu limite de requisição proporcional ao envelope cifrado do cofre. | **Corrigido.** A API pública não aceita mais o teto herdado de 50 MB. [14] |
| Cofre público não tinha rate limiting ou quota. | Foram incluídas quota persistente global e limitação por origem sem salvar IP em claro, além de validação mais rigorosa do envelope Base64URL e da representação canônica. | **Corrigido quanto ao abuso de escrita.** Testes cobrem a quota e envelopes malformados. [15] [16] |
| Limpeza de cofres expirados era oportunística. | O modelo de ameaça e a documentação agora descrevem claramente essa limitação e os controles atuais. | **Parcial.** A limpeza programada dedicada ainda é recomendada; não foi adicionada nesta entrega para não introduzir um job periódico sem política operacional própria. [16] |
| Política de privacidade não identificava responsável, cofre e transporte. | Criada `POLITICA_DE_PRIVACIDADE.md` com responsável identificado, canal de contato, tratamento do cofre, natureza pseudonimizada do conteúdo cifrado e limitação sobre logs de infraestrutura. | **Corrigido documentalmente.** É uma política operacional do projeto, não substitui revisão jurídica independente. [17] |

O modelo de privacidade por padrão permanece o mesmo: respostas ficam na aba; o cofre é opt-in; o servidor recebe apenas envelope cifrado. O relatório externo estava correto ao diferenciar o payload cifrado dos metadados de transporte. Essa distinção passou a estar expressa na política e no modelo de ameaça. [16] [17]

## 5. Codificação, candidaturas, retratos e licenças

| Achado | Resposta implementada | Estado e limites |
| --- | --- | --- |
| Codebook de codificação e limites de revisão por uma pessoa não eram públicos. | Criado `docs/codebook-codificacao.md`, com escala de posição, confiança, evidência, regras de ambiguidade e a limitação explícita de codificador único. | **Corrigido.** A documentação não reivindica confiabilidade intercodificadores inexistente. [18] |
| Retrato de Clariana não tinha licença verificável; retrato de Flávio era antigo. | Os dois retratos foram substituídos por fotos eleitorais oficiais do TSE; os créditos foram atualizados. | **Corrigido.** O catálogo agora informa procedência padronizada e exclui vices. [19] [20] |
| Critério de inclusão e status de candidaturas não eram explicitados. | Criado `shared/candidate-registry-2026.json` e `docs/criterio-inclusao-candidaturas.md`, vinculados ao conjunto oficial do TSE. | **Corrigido para a fotografia de dados de 19/08/2026.** Atualizações posteriores de registro, substituição ou desistência exigem nova revisão documentada; não há sincronização automática. [20] [21] |
| Lula aparecia como “Coligação” em vez de PT. | Metadados públicos, cadastro eleitoral, inventário documental e catálogo passaram a identificar **Luiz Inácio Lula da Silva — PT**. | **Corrigido.** Há teste de regressão específico para impedir retorno da divergência. [20] [22] |
| Matriz e documentação não tinham licença própria clara. | Criado `DATA_LICENSE.md`: código sob MIT; matriz, questões, metadados e documentação próprios sob CC BY 4.0; fontes e retratos de terceiros não são relicenciados. | **Corrigido.** O escopo de licença foi separado de modo explícito. [23] |

## 6. Itens metodológicos e de engenharia que permanecem abertos

Nem toda recomendação do relatório externo era uma correção de defeito já presente; algumas são evoluções metodológicas que exigem nova coleta, revisão humana independente ou decisão de governança. Elas não foram silenciosamente marcadas como resolvidas.

| Recomendação externa | Situação atual | Próxima ação recomendada |
| --- | --- | --- |
| Dupla codificação e Krippendorff’s α. | **Não implementado.** O codebook torna o processo mais reproduzível, mas não cria um segundo codificador. | Recrutar dois revisores independentes, amostrar itens e publicar concordância/divergências. |
| Auditoria de saltos inferenciais em ~300 posições. | **Não implementado integralmente.** Regras de evidência estão no codebook. | Auditar por amostra, ajustar confiança/posição e registrar cada mudança no changelog. |
| Rebalancear direções normativas para reduzir aquiescência. | **Não alterado nesta versão.** Isso modifica a matriz e exige revisão estrutural. | Planejar matriz v2 com auditoria por eixo e pré-teste de compreensão. |
| Snapshot canônico, testes baseados em propriedades, e2e e axe-core. | **Parcial.** Foram adicionadas regressões de cálculo, comparabilidade, cofre, catálogo e TSE; a suíte total chega a 29 testes. | Acrescentar Playwright + axe-core no CI e propriedades formais do scoring. |
| Decompor `Home.tsx`. | **Não implementado.** | Separar telas, componentes de resultados e de método em módulos menores, preservando a cobertura atual. |
| Observabilidade técnica sem payload. | **Não implementado**, por opção conservadora de privacidade nesta entrega. | Definir política de telemetria técnica agregada antes de integrar OpenTelemetry. |
| Atestações SLSA de build. | **Não implementado.** | Configurar CI de release com artifact attestation e publicar o digest no rodapé. |
| Limpeza programada de cofres. | **Não implementado.** | Definir retenção, job de limpeza e monitoramento compatíveis com a política de privacidade. |
| Triagem dos PRs Dependabot. | **Pendente.** Há sete PRs abertos (PRs #1 a #7). | Revisar dependências em lote, executar CI por PR e integrar somente atualizações compatíveis. [24] |

## 7. Validações realizadas

| Verificação | Resultado |
| --- | --- |
| `pnpm test` | **29 testes aprovados** em cinco arquivos. |
| `pnpm check` | **Aprovado**, sem erros TypeScript. |
| `pnpm build` | **Aprovado**. Há aviso de bundle acima de 500 kB, sem falha de compilação. |
| `pnpm run verify:integrity` | **Aprovado**, matriz `2026.08.19.3` e fingerprint `680cc2f743b71a27…`. |
| CI PR #10 | **Aprovado**. [5] |
| CI PR #11 | **Aprovado**. [2] [3] |
| Revisão visual | Método verificado em desktop e em 375 × 812; o domínio público foi também verificado após a publicação final. [4] |

## 8. Conclusão

As correções alteram principalmente a **honestidade de interpretação do resultado** e a **verificabilidade da evidência**. A cobertura agora mede apenas comparações que o eleitor realmente permitiu; programas com pouca documentação deixam de competir como se estivessem em condições equivalentes; documentos e metadados podem ser conferidos por hashes, fonte oficial e preservação pública; e o cofre recebeu controles contra abuso compatíveis com seu modelo de privacidade.

O projeto ficou mais auditável, mas não deve alegar perfeição. A prioridade seguinte é institucional, não cosmética: segunda codificação independente, atestação formal de build, testes e2e/acessibilidade contínuos, rotina de atualização eleitoral e revisão jurídica profissional da política de privacidade e do período eleitoral.

## Addendum — verificação posterior e correção de ordenação

Uma verificação posterior confirmou as correções anteriores, mas identificou duas pendências introduzidas ou expostas pela revisão: dentro do conjunto comparável, a ordenação priorizava cobertura antes de afinidade; e o teste de adulteração do cofre podia manter o mesmo último caractere Base64URL por acaso. Ambas foram corrigidas na matriz `2026.08.19.4`.

O ranking agora usa **afinidade decrescente** como chave primária entre programas comparáveis; cobertura e número de comparações só desempatam valores iguais e continuam sendo requisitos de entrada no ranking. Destaque principal, gráfico, radar e lista consomem a mesma sequência ordenada. O teste do cofre passou a alterar um byte decodificado e recodificá-lo, assegurando que o ciphertext de teste seja sempre distinto. Foram adicionadas regressões para esses fluxos; a suíte final contém 30 testes aprovados, e o teste criptográfico foi executado dez vezes seguidas sem falha.

## Confirmação de terceira reauditoria

Uma terceira reauditoria independente leu o commit `532113d`, reproduziu os gates locais e confirmou a correção da ordenação por afinidade, a atualização de documentação e manifesto e a estabilização determinística do teste de adulteração criptográfica. A conferência local subsequente registrou novamente 30 testes aprovados, tipagem sem erros e manifesto `2026.08.19.4 · e58917fa9fb0b13c`.

> **Nota jurídica.** Este relatório descreve medidas técnicas e documentais adotadas; não é parecer jurídico nem substitui revisão por advogado ou profissional de proteção de dados habilitado.

## Referências

[1]: https://github.com/apenasgabreu/brasil-compasso-politico/commit/f4e2918aa69f8db3513205808934ca601fcc64dd "Commit principal atual no GitHub"
[2]: https://github.com/apenasgabreu/brasil-compasso-politico/pull/11 "PR #11 — correção de proveniência de build"
[3]: https://github.com/apenasgabreu/brasil-compasso-politico/actions/runs/32281347457 "CI do PR #11"
[4]: https://brasilcpol-fqgbdhtx.manus.space/metodo "Rota pública Método em produção"
[5]: https://github.com/apenasgabreu/brasil-compasso-politico/pull/10 "PR #10 — correções de auditabilidade, proveniência, privacidade e metadados"
[6]: https://archive.org/details/brasil-em-perspectiva-documentos-2026 "Pacote público permanente dos documentos-fonte"
[7]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/client/src/lib/scoring.ts "Código de cálculo de afinidade, cobertura e coordenadas"
[8]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/shared/methodology-changelog.json "Changelog metodológico"
[9]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/docs/decisoes-produto.md "Decisões de produto e integridade documental"
[10]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/shared/source-document-integrity.json "Inventário de integridade dos documentos-fonte"
[11]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/shared/matrix-integrity.json "Manifesto SHA-256 da matriz"
[12]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/docs/documentos-fonte-integridade.md "Política de integridade e preservação dos documentos"
[13]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/client/src/lib/buildProvenance.ts "Proveniência de build no cliente"
[14]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/server/routers.ts "Rotas públicas do servidor"
[15]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/server/resultVault.test.ts "Testes do cofre cifrado e quotas"
[16]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/docs/resultados-persistentes-cifrados.md "Arquitetura e limites do cofre cifrado"
[17]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/POLITICA_DE_PRIVACIDADE.md "Política de privacidade"
[18]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/docs/codebook-codificacao.md "Codebook de codificação"
[19]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/docs/creditos-retratos.md "Créditos e procedência dos retratos"
[20]: https://dadosabertos.tse.jus.br/dataset/candidatos-2026 "Dados Abertos do TSE — candidaturas de 2026"
[21]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/docs/criterio-inclusao-candidaturas.md "Critério de inclusão de candidaturas"
[22]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/client/src/pages/Home.nesting.test.ts "Teste de regressão do catálogo e do PT"
[23]: https://github.com/apenasgabreu/brasil-compasso-politico/blob/main/DATA_LICENSE.md "Licença de dados metodológicos e documentação"
[24]: https://github.com/apenasgabreu/brasil-compasso-politico/pulls "Pull requests abertos"
