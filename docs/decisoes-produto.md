# Decisões de produto e metodologia inicial

## Escopo e privacidade

O questionário será executado inteiramente no navegador. As respostas existirão apenas na memória da aba durante a sessão: não serão enviadas a rotas de aplicação, não serão gravadas em banco de dados, não serão mantidas em `localStorage`, não usarão cookies e não alimentarão ferramentas de análise. A explicação individual é determinística e produzida localmente a partir das respostas e da mesma matriz de evidências; não há modelo de linguagem, WebGPU ou download de modelo no produto.

## Neutralidade e rastreabilidade

Cada posição atribuída a um candidato será associada a uma passagem direta do programa, ao nome do PDF, à página, ao eixo temático e a um nível de confiança. Não serão inferidas posições a partir de filiação partidária, entrevistas, votações, declarações públicas ou avaliações externas. Quando o programa for silencioso, vago ou internamente contraditório sobre uma afirmação, a posição será marcada como indisponível ou de baixa confiança; ela não será convertida artificialmente em concordância ou discordância.

As afirmações do questionário serão redigidas sem nomes de candidatos, com vocabulário normativo simétrico e alternativas completas de concordância. Cada uma medirá uma única ideia política. A ordem será organizada por eixo, porém embaralhada dentro de cada página para reduzir efeitos de sequência. A opção “Não sei / Prefiro não responder” excluirá a questão do denominador do usuário, sem ser convertida em ponto neutro.

## Pontuação e incerteza

As respostas do eleitor e as posições programáticas serão codificadas em uma escala de -2 a +2. Para cada afirmação coberta, a afinidade será calculada como `1 - |resposta - posição| / 4`. A afinidade final de cada programa será a média ponderada das afinidades disponíveis, ponderada pela importância escolhida para o eixo e pelo nível de confiança da evidência. A cobertura é uma métrica separada e não ponderada: itens comparados ÷ itens respondidos. Eixos sem resposta ficam fora de seu denominador. Para impedir que poucas coincidências recebam uma colocação visual dominante, o ranking exige ao menos oito comparações e cobertura de 40%; abaixo disso, a afinidade é exibida apenas na seção “dados insuficientes”. Ausências não serão tratadas como concordância nem usadas para penalizar o eleitor.

O mapa bidimensional será uma visualização auxiliar, não um diagnóstico ideológico completo. A coordenada econômica será derivada exclusivamente de afirmações previamente classificadas nesse eixo; a coordenada social/liberdades, de afirmações classificadas nesse segundo eixo. Cada coordenada é normalizada pela soma dos valores absolutos dos fatores e só é exibida quando houver pelo menos três itens documentados em cada dimensão, acompanhada do número de itens usado.

## Evidências, contexto e linguagem clara

O detalhamento de cada candidatura exibirá propostas concretas em áreas de maior e menor alinhamento, acompanhadas de transcrição literal, referência de página e vínculo ao PDF disponibilizado no próprio produto. O inventário de documentos registra o SHA-256 de cada arquivo originalmente analisado, a URL de entrega e o catálogo oficial do TSE para verificação externa; a aplicação não alega depósito permanente antes que ele exista. Fontes acadêmicas revisadas por pares serão empregadas para justificar a escolha dos eixos, as limitações de escalas ideológicas e práticas de elaboração de questionários. Indicadores de contexto serão provenientes prioritariamente de órgãos oficiais e multilaterais com metodologia pública; eles não alterarão a pontuação programática.

O texto personalizado é determinístico: explicará somente padrões calculados, respostas do usuário e trechos catalogados do programa. Ele não poderá introduzir informações externas, previsões, juízos morais ou recomendações de voto e citará as evidências que sustentam cada afirmação.

## Direção visual

A interface adotará uma linguagem editorial cívica contemporânea: fundo marfim suave, azul-profundo como cor estrutural, acento cobre discreto, contrastes compatíveis com WCAG 2.2 AA, serifada de leitura para títulos e sans-serif de alta legibilidade para controles e dados. A navegação será sequencial e clara, com progresso visível, alvos de toque amplos, foco de teclado evidente, gráficos com equivalentes textuais e ausência de animações que prejudiquem pessoas com preferência por movimento reduzido.
