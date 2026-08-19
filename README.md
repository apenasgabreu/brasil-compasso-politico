# Brasil em Perspectiva

> Um questionário programático, auditável e privado para comparar prioridades do eleitor com posições documentadas em programas de governo.

**Brasil em Perspectiva** não recomenda voto, não mede competência eleitoral e não infere intenção de voto. A ferramenta transforma respostas a 50 afirmações em uma comparação com posições extraídas dos programas de governo analisados. Cada resultado mostra o nível de afinidade, a cobertura documental, a leitura por eixo, as citações e as páginas de origem.

O projeto está disponível em [brasilcpol-fqgbdhtx.manus.space](https://brasilcpol-fqgbdhtx.manus.space).

## O que a ferramenta oferece

| Recurso | Como funciona |
|---|---|
| **Questionário amplo** | Cinquenta afirmações neutras em dez eixos, com escala de concordância e opção de não resposta. |
| **Ponderação por prioridade** | A pessoa escolhe a importância de cada eixo, sem alterar a posição atribuída aos programas. |
| **Afinidade e cobertura** | A afinidade compara somente itens com posição documentada; a cobertura indica quanto o programa permitiu comparar. |
| **Evidências rastreáveis** | Resultados mostram propostas, citações diretas, páginas e links para os documentos analisados. |
| **Visualizações** | Ranking, gráfico de barras, radar por eixo e mapa econômico × social/liberdades. |
| **Compartilhamento voluntário** | Resumo e card para Story são gerados somente quando a pessoa escolhe compartilhar. |
| **Resultado recuperável** | Opcionalmente, o navegador cifra o resultado e emite um código secreto para recuperá-lo por até 365 dias. |

## Como interpretar o resultado

A porcentagem **não é uma nota da candidatura**, nem uma projeção eleitoral. Ela é a média ponderada de concordância entre as respostas do eleitor e as posições que puderam ser documentadas no programa.

> **Afinidade** informa o grau de acordo nos itens comparáveis. **Cobertura** informa a proporção de questões para as quais o documento apresentou posição suficiente. Uma afinidade alta com cobertura baixa deve ser lida com cautela.

Posições vagas, ausentes ou contraditórias não são transformadas artificialmente em concordância ou discordância. O mapa bidimensional é uma visualização auxiliar; não resume toda a identidade política de uma pessoa ou candidatura.

## Privacidade e recuperação persistente

Por padrão, respostas e resultados ficam apenas na memória da aba. Não há cookies de rastreamento nem persistência automática.

Quem quiser recuperar um resultado depois pode criar um **cofre cifrado**. O navegador gera um identificador aleatório, cria uma chave de recuperação de 256 bits, cifra o snapshot localmente com AES-GCM e envia somente o envelope cifrado para o servidor. O banco armazena identificador, ciphertext, IV, versão e datas — não armazena respostas, ranking em claro ou a chave secreta.

O código `BRCP-…` é a única forma de abrir o cofre. Ele deve ser guardado em local seguro, não deve ser publicado e não pode ser recuperado se for perdido. O cofre é imutável e expira após 365 dias. Consulte a [documentação de segurança](docs/resultados-persistentes-cifrados.md) para o modelo, as garantias e os limites.

## Metodologia e fontes

A matriz programática é versionada e associada a citações diretas, páginas, eixos e confiança documental. Literatura acadêmica revisada por pares fundamenta a escolha dos eixos, as limitações de aplicações de afinidade eleitoral e as decisões de desenho do questionário. Indicadores oficiais servem apenas de contexto e não afetam a pontuação.

O livro *Brasil no Espelho* é utilizado somente como fonte contextual de comunicação e experiência de uso; ele não altera posições, pesos, ranking ou cálculo. Os documentos abaixo detalham a abordagem:

- [Decisões de produto e neutralidade](docs/decisoes-produto.md)
- [Matriz e questionário](docs/matriz-questionario.md)
- [Fontes metodológicas](docs/fontes-metodologicas.md)
- [Diagnóstico de compreensão](docs/diagnostico-compreensao-inicial.md)
- [Diretrizes de UX](docs/diretrizes-ux-brasil-no-espelho.md)
- [Créditos dos retratos](docs/creditos-retratos.md)
- [Validação técnica e acessibilidade](docs/validacao-final.md)

## Arquitetura

| Camada | Tecnologia |
|---|---|
| Interface | React 19, TypeScript, Tailwind CSS e componentes acessíveis. |
| API | Express e tRPC com contratos tipados. |
| Dados persistentes | MySQL/TiDB via Drizzle ORM; somente cofres já cifrados. |
| Criptografia do cofre | Web Crypto API, AES-GCM e código de recuperação gerado no navegador. |
| Testes | Vitest para cálculo, criptografia, router, compartilhamento, HTML e regressões de UX. |

## Executar localmente

### Pré-requisitos

Use Node.js 22 ou superior e `pnpm`. O projeto necessita de uma URL de banco para a recuperação persistente; os demais fluxos funcionam sem salvar resultados.

```bash
pnpm install
pnpm dev
```

Em outro terminal, use os comandos abaixo para validar o projeto:

```bash
pnpm test
pnpm check
pnpm build
```

Não versione arquivos `.env`, chaves, códigos de recuperação ou cópias de dados pessoais. O `.gitignore` já protege os arquivos de ambiente mais comuns.

## Contribuir

Contribuições devem preservar quatro compromissos: neutralidade metodológica, rastreabilidade documental, acessibilidade e privacidade. Antes de abrir uma alteração, leia [CONTRIBUTING.md](CONTRIBUTING.md) e execute a suíte de testes.

Erros de segurança devem ser reportados conforme [SECURITY.md](SECURITY.md), e não por issue pública.

## Limitações importantes

- A ferramenta compara textos programáticos recebidos e documentados; ela não substitui a leitura integral dos programas.
- Uma posição ausente reduz cobertura, em vez de ser inferida.
- O resultado não é recomendação de voto ou previsão eleitoral.
- A recuperação cifrada não protege contra dispositivo comprometido, compartilhamento do código ou perda do próprio código.

## Licença

Este projeto é distribuído sob a [Licença MIT](LICENSE).
