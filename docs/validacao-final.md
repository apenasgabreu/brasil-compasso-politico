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
