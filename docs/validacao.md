# Registro de validação

## Verificação visual — 17 de agosto de 2026

Foram verificados os estados iniciais da aplicação em desktop (1280 × 720) e celular (375 × 812). A leitura principal, o card explicativo, a navegação, os botões de ação, os avisos de privacidade e o rodapé permanecem visíveis e legíveis nos dois tamanhos. Em tela móvel, a composição passa para uma coluna única sem corte de texto e mantém controles com área de toque adequada.

O contraste de elementos essenciais foi mantido por pares de texto e fundo: azul-profundo com texto branco no card metodológico, texto azul-profundo sobre fundo marfim e botão de ação azul-profundo com texto branco. A interface inclui foco visível, semântica de `fieldset` e `legend` no questionário, rótulos para controles de importância e equivalentes textuais para os gráficos. A avaliação final também deve abranger navegação integral pelo teclado e conferência de evidências em cada programa.

## Verificação técnica — 17 de agosto de 2026

`pnpm test` executou quatro testes com sucesso, incluindo três cenários do algoritmo: afinidade máxima/mínima, exclusão de resposta não informada e ausência de cobertura documental. `pnpm check` concluiu sem erros de TypeScript. `pnpm build` concluiu com êxito. O empacotador emitiu aviso de tamanho elevado para o fragmento da biblioteca de IA local, esperado porque o recurso é carregado somente quando o usuário o solicita.

Após o refinamento metodológico, a suíte passou a cobrir também o multiplicador de confiança documental. Foram concluídos com sucesso cinco testes, a verificação de tipos e a compilação de produção. A página de resultados passou a conter gráfico de barras, radar por eixo e explicação determinística individual que aponta uma convergência e uma divergência a partir de resposta, posição, citação e página documentais.

A ação de IA local passou a estar disponível em cada linha do ranking, mediante consentimento explícito para baixar e executar o modelo no próprio dispositivo. O contexto entregue ao modelo contém apenas comparações item a item com resposta do eleitor, posição registrada, citação e página; o sistema instrui o modelo a não usar fatos externos, recomendar voto ou tratar temas ausentes.

O fluxo de introdução, ponderação e primeiro eixo do questionário foi validado na prévia interativa. As cinco alternativas e a opção de não resposta aparecem em grupos rotulados, e a navegação entre as etapas usa botões semânticos. A auditoria de código do cliente não encontrou uso de `localStorage`, `sessionStorage`, cookies, `fetch`, `axios` ou chamadas tRPC nas telas e bibliotecas do questionário.

Na validação por teclado, `Tab` tornou visível o foco primeiro na marca e depois na navegação principal; `Enter` ativou o retorno à introdução e a página de metodologia. O fluxo de teste também percorreu ponderação, os dez eixos do questionário e a página de resultados, que contém barra, radar, mapa e controles por programa. A tela de metodologia confirmou a lista de fontes, a classificação da obra contextual e os doze vínculos documentais.

As razões de contraste foram calculadas objetivamente para as combinações críticas: texto principal 14,93:1, botão primário 12,49:1, painel escuro 12,49:1, texto mutado 4,65:1, rótulos em terracota 5,28:1, links 12,29:1 e selo de sucesso 5,55:1. Todas superam 4,5:1 para texto normal no critério WCAG AA. A validação visual em desktop e celular confirma reflow em coluna, foco visível, legibilidade e manutenção dos controles sem corte de conteúdo.

O teste de resultados também identificou e corrigiu um caso de cobertura reduzida: a explicação não descreve mais uma divergência isolada como convergência. A suíte passou a conter seis testes em execução bem-sucedida.

A validação complementar abriu o detalhamento de Romeu Zema por ativação de teclado do controle “Detalhar” e retornou à lista pelo botão “Voltar aos resultados”, também ativado por teclado. A auditoria estática abrangente confirmou dez condições presentes no código: foco visível, preferência por movimento reduzido, agrupamento semântico de respostas, rótulo para ponderação, não resposta explícita, mensagens anunciáveis, descrição textual do mapa, alternativa textual para gráficos, controles nativos e navegação semântica. A compilação final de produção concluiu com êxito.
