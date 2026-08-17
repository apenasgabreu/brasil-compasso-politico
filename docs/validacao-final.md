# Validação final — 17 de agosto de 2026

## Percurso por teclado

O foco visível foi confirmado por `Tab` na marca e na navegação principal. `Enter` acionou a introdução e a página de metodologia. Após o preenchimento de teste, o foco foi colocado no primeiro controle de detalhamento e `Enter` abriu a página documental; o botão “Voltar aos resultados” também foi acionado por `Enter`, retornando à lista de afinidades.

## Auditoria estática de acessibilidade

Uma verificação automatizada do código confirmou foco visível, respeito a `prefers-reduced-motion`, `fieldset` e `legend` nas respostas, rótulos de ponderação, alternativa de não resposta, mensagens com `role="status"`, rótulo textual do mapa, alternativa textual às visualizações, controles nativos e navegação semântica.

## Contraste, privacidade e interfaces

As combinações críticas de texto e fundo apresentaram razões entre 4,65:1 e 14,93:1, atendendo ao limiar de 4,5:1 para texto normal no WCAG AA. O registro visual inclui verificações da página em desktop e celular. A auditoria do cliente não identificou armazenamento local, cookies, chamadas HTTP, `axios` ou tRPC no fluxo do questionário.

## Integridade técnica

Seis testes unitários foram concluídos com sucesso, a checagem de tipos não apresentou erros e a compilação de produção terminou com êxito. O pacote de IA local amplia o tamanho de um fragmento carregado sob demanda, o que foi reportado pelo empacotador como aviso, sem impedir a geração da aplicação.

## Atualização de linguagem e compartilhamento

O diagnóstico textual revisou as cinquenta afirmações e identificou dez itens com jargão ou abstração institucional concentrada. Esses itens foram reescritos sem modificar seus identificadores, eixo, direção normativa ou posições documentais, preservando o cálculo. As funções de compartilhamento possuem quatro testes unitários: composição do texto, links sociais sem respostas individuais, cópia local com sucesso e erro, indisponibilidade do compartilhamento nativo e download local do card de Story.

Os resultados exibem retratos de fonte rastreável para as candidaturas identificadas e permitem abrir a fonte da imagem. Programas sem pessoa candidata indicada nos documentos permanecem sem retrato. A página de resultados foi verificada em desktop com o painel de compartilhamento e as imagens renderizadas; a interface geral foi verificada em celular. “Preparar para Story” usa o seletor nativo quando disponível ou baixa o card localmente; a publicação é sempre decisão do eleitor.

Na verificação interativa da rota de resultados, o painel de compartilhamento foi encontrado e onze imagens de retrato foram carregadas, incluindo a dupla do PCB. Uma prévia exclusiva de desenvolvimento foi usada para inspecionar diretamente a rota de resultados em 375 × 812: retratos, painel social, botões e ranking foram exibidos em coluna, sem corte horizontal. A prévia foi removida após a verificação.

A captura móvel focalizada confirmou a legibilidade do painel social: o resumo, os botões “Compartilhar”, “Preparar para Story” e “Copiar resumo”, além dos links para WhatsApp e X, permaneceram visíveis e separados em 375 × 812. Após a remoção de toda a prévia temporária, a suíte com dez testes, a checagem de tipos e a compilação de produção voltaram a concluir com êxito.

## Atualização de retratos e Story

O retrato de Lula foi substituído por foto oficial frontal. As candidaturas associadas aos programas antes exibidos apenas como sigla foram atualizadas para **Hertz Dias — PSTU**, **Rui Costa Pimenta — PCO** e **Wilson Grassi — Democrata**, usando retratos eleitorais do TSE com crédito e página-fonte. A interface passou a exibir somente a pessoa candidata à Presidência; retratos de vices foram removidos.

O card local para Story passou a incluir o retrato da candidatura de maior afinidade e o bloco “De onde vem este resultado”, que informa que o resultado é calculado localmente a partir das respostas do eleitor comparadas às posições documentadas no programa. A exportação PNG foi testada no navegador com retrato e origem metodológica, gerando arquivo válido de 2,15 MB sem transmissão de respostas.

Uma prévia ampliada do PNG foi revisada visualmente no navegador. O card exibiu retrato frontal de Lula, identificação da candidatura, afinidade de 74%, cobertura de 68% e o bloco “De onde vem este resultado”, incluindo a referência ao Livro do Plano de Governo. A hierarquia, o contraste e a legibilidade permaneceram adequados na composição vertical de Story.

## Correção de markup — 17 de agosto de 2026

O catálogo de programas antes combinava o link externo do PDF com o componente de retrato, que também gerava um link para a fonte da foto. O componente passou a renderizar o retrato como elemento estático dentro do catálogo, preservando o link externo do documento e evitando a estrutura inválida `a > a`. A verificação do DOM da página de metodologia encontrou **0** âncoras aninhadas, **12** links de catálogo e **0** links de retrato dentro deles. A suíte passou com 13 testes, incluindo teste de regressão, e a compilação de produção concluiu com êxito.

O teste de regressão agora renderiza o componente do catálogo em HTML estático e verifica diretamente que não existe uma âncora dentro de outra, mantendo doze links de documentos. Em uma sessão limpa, a navegação introdução → metodologia foi repetida com captura temporária de `console.error`: o resultado foi **0** erros capturados, **0** avisos de nesting do React e **0** âncoras aninhadas no DOM.
