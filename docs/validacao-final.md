# Validação final — 17 de agosto de 2026

## Percurso por teclado

O foco visível foi confirmado por `Tab` na marca e na navegação principal. `Enter` acionou a introdução e a página de metodologia. Após o preenchimento de teste, o foco foi colocado no primeiro controle de detalhamento e `Enter` abriu a página documental; o botão “Voltar aos resultados” também foi acionado por `Enter`, retornando à lista de afinidades.

## Auditoria estática de acessibilidade

Uma verificação automatizada do código confirmou foco visível, respeito a `prefers-reduced-motion`, `fieldset` e `legend` nas respostas, rótulos de ponderação, alternativa de não resposta, mensagens com `role="status"`, rótulo textual do mapa, alternativa textual às visualizações, controles nativos e navegação semântica.

## Contraste, privacidade e interfaces

As combinações críticas de texto e fundo apresentaram razões entre 4,65:1 e 14,93:1, atendendo ao limiar de 4,5:1 para texto normal no WCAG AA. O registro visual inclui verificações da página em desktop e celular. A auditoria do cliente não identificou armazenamento local, cookies, chamadas HTTP, `axios` ou tRPC no fluxo do questionário.

## Integridade técnica

Seis testes unitários foram concluídos com sucesso, a checagem de tipos não apresentou erros e a compilação de produção terminou com êxito. O pacote de IA local amplia o tamanho de um fragmento carregado sob demanda, o que foi reportado pelo empacotador como aviso, sem impedir a geração da aplicação.

