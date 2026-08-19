# Validação final — 17 de agosto de 2026

## Percurso por teclado

O foco visível foi confirmado por `Tab` na marca e na navegação principal. `Enter` acionou a introdução e a página de metodologia. Após o preenchimento de teste, o foco foi colocado no primeiro controle de detalhamento e `Enter` abriu a página documental; o botão “Voltar aos resultados” também foi acionado por `Enter`, retornando à lista de afinidades.

## Auditoria estática de acessibilidade

Uma verificação automatizada do código confirmou foco visível, respeito a `prefers-reduced-motion`, `fieldset` e `legend` nas respostas, rótulos de ponderação, alternativa de não resposta, mensagens com `role="status"`, rótulo textual do mapa, alternativa textual às visualizações, controles nativos e navegação semântica.

## Contraste, privacidade e interfaces

As combinações críticas de texto e fundo apresentaram razões entre 4,65:1 e 14,93:1, atendendo ao limiar de 4,5:1 para texto normal no WCAG AA. O registro visual inclui verificações da página em desktop e celular. A auditoria do cliente não identificou armazenamento local, cookies, chamadas HTTP, `axios` ou tRPC no fluxo do questionário.

## Integridade técnica

Na validação de 19 de agosto de 2026, 28 testes unitários concluíram com sucesso, a checagem de tipos não apresentou erros e a compilação de produção terminou com êxito. Não há pacote, modelo, controle ou fragmento de IA local no produto atual; a explicação usada é determinística e baseada em evidências catalogadas.

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

## Padronização de retratos — 17 de agosto de 2026

A auditoria identificou uma única inconsistência: no catálogo da página de metodologia, os retratos deixaram de ser links para eliminar âncoras aninhadas, mas o novo elemento estático não recebia as regras de tamanho, recorte e borda antes aplicadas apenas a âncoras. Por isso, imagens eram exibidas em seus tamanhos naturais. As regras foram unificadas para aplicar dimensões, círculo, `object-fit: cover` e `object-position: center top` tanto aos retratos vinculados quanto aos estáticos.

Os contextos de resultados e detalhamento já usam retratos vinculados com as mesmas regras de 58 × 58 px, ou 32 × 32 px na versão compacta. O card de Story usa outro contexto intencional: recorte circular de 250 × 250 px dentro do canvas. No catálogo corrigido, a inspeção de DOM confirmou 12 retratos estáticos, todos em 32 × 32 px, circulares e com `object-fit: cover`; a grade mantém uma coluna em telas menores pelo breakpoint existente. A suíte com 13 testes, a checagem de tipos e a compilação concluíram com êxito.

A página Método foi capturada em 375 × 812 após a correção: os doze retratos permanecem compactos, circulares, alinhados aos nomes e em coluna única sem corte horizontal. Todos os doze `img` possuem texto alternativo não vazio. Os cartões de programa seguem focáveis; ao navegar por teclado, o foco foi verificado com contorno sólido de 3 px na cor de destaque, sem reintroduzir links internos nos retratos.

As capturas de interface em desktop e celular foram usadas somente como inspeção manual de desenvolvimento. Elas não constituem evidência quantitativa de reconhecimento individual; as conclusões auditáveis desta atualização baseiam-se nas regras CSS, na contagem de elementos, nos textos alternativos, no foco por teclado e no teste determinístico descritos a seguir.

Além da revisão de interface, um teste determinístico passou a verificar o catálogo renderizado e a folha de estilos: doze retratos estáticos com texto alternativo, container circular, `object-fit: cover`, dimensões de 58 × 58 px, variante compacta de 32 × 32 px e breakpoint de catálogo em coluna única. A suíte encerrou com 14 testes aprovados, além de tipagem e build sem erros.

## Orientação progressiva baseada em fonte contextual — 17 de agosto de 2026

Foram incluídos seis avisos de orientação, um em cada etapa principal: introdução, ponderação, questionário, resultados, detalhamento e método. Eles esclarecem que não há resposta certa, que peso não muda programas, que não responder é válido, que afinidade e cobertura devem ser lidas juntas, que evidências podem ser verificadas e que a documentação completa permanece disponível. Controles, gráficos, citações, detalhamento e compartilhamento foram preservados; a IA local foi retirada posteriormente por solicitação explícita.

O teste de regressão verifica a presença das seis orientações e dos rótulos de ação “Começar com privacidade”, “Ir ao questionário”, “Ver resultados”, “Ler evidências”, “Preparar para Story” e “Fazer o questionário”. A suíte executou 15 testes com sucesso, seguidos de checagem de tipos e build. A introdução foi verificada em desktop e em 375 × 812; no formato móvel, os três avisos de preparo, a orientação principal e as duas ações continuam presentes no fluxo.

Resultados, detalhamento e método foram verificados em desktop e em 375 × 812 com as novas orientações presentes e ações preservadas: compartilhamento, Story, cópia, detalhamento, PDF original, mapa, retorno e início do questionário. A checagem determinística confirma que os avisos usam `role="note"`, que há seis pontos de orientação e que o CSS inclui adaptação móvel. No fluxo padrão, `Home.tsx` não usa armazenamento local, cookies ou chamadas manuais para respostas; o único envio opcional é o envelope já cifrado via procedimento tipado de cofre. Depois da remoção das prévias temporárias de desenvolvimento, a suíte executou 16 testes com sucesso, seguida de tipagem e build.

Uma inspeção textual das prévias confirmou, na página de resultados, os controles de evidências, compartilhamento, Story, cópia, WhatsApp, X, detalhamento e metodologia; no detalhamento, confirmou retorno, PDF original, consulta ao documento, evidências e mapa; e no método, confirmou fontes, doze documentos, retorno e início do questionário. A inspeção DOM do aviso em Método encontrou um `aside` com `role="note"` e zero descendentes focáveis, coerente com sua finalidade informativa e sem introduzir uma etapa de teclado adicional.

## Resultado persistente e remoção de IA local — 19 de agosto de 2026

O módulo e a dependência de IA local foram removidos, assim como seus controles de consentimento e referências de interface. A explicação determinística baseada nas respostas e evidências documentais permanece. Uma busca de código, excluindo os próprios testes de regressão, não encontrou referências executáveis a LLM local, `@mlc-ai/web-llm` ou controles de geração por IA.

O resultado persistente foi implementado como cofre AES-GCM gerado no navegador. O banco mantém apenas identificador opaco, ciphertext, IV, versão e datas; o segredo de 256 bits fica exclusivamente no código exibido à pessoa. A interface foi testada de ponta a ponta: criou o cofre, mostrou o código, limpou a sessão e recuperou o mesmo resultado por esse código. O cofre de validação foi removido em seguida. A recuperação não expõe chave ou respostas ao procedimento público do servidor, como comprovado pelo teste de router; o cofre expira após 365 dias e registros vencidos são eliminados oportunisticamente.

A introdução, em 375 × 812, preserva as ações existentes e adiciona o painel “Recupere um resultado cifrado”, com campo de código e aviso de que o segredo não é enviado ao servidor. A suíte final executou 23 testes, incluindo AES-GCM, detecção de modificação, não determinismo, router de cofre, rejeição de envelope malformado e ausência de IA local; tipagem e build concluíram com êxito.

## Correções de auditabilidade e transparência — 19 de agosto de 2026

A rota pública `/metodo` foi carregada diretamente em desktop e em 375 × 812. A página exibiu o changelog até a versão `2026.08.19.3`, a impressão digital da matriz, o arquivo público permanente dos documentos, a referência ao conjunto oficial de candidaturas do TSE, o canal de privacidade e os 12 documentos com hashes abreviados. Em tela móvel, os avisos, links de proveniência, cartões documentais e ações finais permaneceram em coluna única, sem corte horizontal.

A validação automatizada desta publicação concluiu 28 testes, checagem de tipos, build e verificação do manifesto SHA-256. O teste de cofre agora cobre a rejeição de quota excedida; o teste de criptografia cobre uma alteração de Base64URL; e o teste do catálogo confirma os links adicionais de proveniência sem reintroduzir âncoras aninhadas.

## Correção de ordenação e estabilidade criptográfica — 19 de agosto de 2026

Após verificação independente, a ordenação dos comparáveis foi corrigida para afinidade decrescente, com cobertura e comparações somente como desempate. Destaque, gráfico, radar e lista consomem a mesma sequência. O teste de adulteração do cofre agora modifica um byte do ciphertext antes de recodificá-lo em Base64URL, evitando a substituição eventual por um caractere idêntico. O teste criptográfico foi repetido dez vezes consecutivas sem falha; a suíte completa passou com 30 testes, tipagem, build e manifesto `2026.08.19.4 · e58917fa9fb0b13c`.

## Dupla codificação, e2e e proveniência — 19 de agosto de 2026

Foi gerada uma folha cega integral de 600 células para o segundo codificador. O teste automatizado confirma que ela não contém posição, confiança ou evidência do primeiro codificador. O protocolo mede decisão de presença documental separadamente da intensidade da posição, preserva divergências e exige reconciliação documentada antes de qualquer atualização da matriz.

Foram adicionados Playwright e axe-core. A auditoria e2e cobre a introdução e a rota direta Método; ela identificou e motivou correções de zoom móvel, contraste e hierarquia de títulos. Após as correções, dois cenários e2e passaram sem violações automáticas. O CI passa a executar esse job em todo push e pull request e, na `main`, empacota o build e cria uma atestação de proveniência verificável depois do sucesso dos gates. A validação local final registrou 32 testes unitários, tipagem, build, integridade `2026.08.19.5 · 561dc65fc6798ea3` e dois testes e2e aprovados.
