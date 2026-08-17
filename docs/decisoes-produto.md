# Decisões de produto e metodologia inicial

## Escopo e privacidade

O questionário será executado inteiramente no navegador. As respostas existirão apenas na memória da aba durante a sessão: não serão enviadas a rotas de aplicação, não serão gravadas em banco de dados, não serão mantidas em `localStorage`, não usarão cookies e não alimentarão ferramentas de análise. A explicação individual será oferecida por um modelo de linguagem executado localmente no dispositivo, mediante ação explícita do usuário e apenas em navegadores compatíveis com WebGPU. O download inicial dos arquivos do modelo não conterá respostas, perfil ou identificador do eleitor. Quando esse recurso não for suportado, uma explicação determinística será produzida localmente a partir da mesma matriz de evidências.

## Neutralidade e rastreabilidade

Cada posição atribuída a um candidato será associada a uma passagem direta do programa, ao nome do PDF, à página, ao eixo temático e a um nível de confiança. Não serão inferidas posições a partir de filiação partidária, entrevistas, votações, declarações públicas ou avaliações externas. Quando o programa for silencioso, vago ou internamente contraditório sobre uma afirmação, a posição será marcada como indisponível ou de baixa confiança; ela não será convertida artificialmente em concordância ou discordância.

As afirmações do questionário serão redigidas sem nomes de candidatos, com vocabulário normativo simétrico e alternativas completas de concordância. Cada uma medirá uma única ideia política. A ordem será organizada por eixo, porém embaralhada dentro de cada página para reduzir efeitos de sequência. A opção “Não sei / Prefiro não responder” excluirá a questão do denominador do usuário, sem ser convertida em ponto neutro.

## Pontuação e incerteza

As respostas do eleitor e as posições programáticas serão codificadas em uma escala de -2 a +2. Para cada afirmação coberta, a afinidade será calculada como `1 - |resposta - posição| / 4`. A afinidade final de cada candidato será a média ponderada das afinidades disponíveis, ponderada pela importância escolhida para o eixo e pelo nível de confiança da evidência. O resultado será exibido junto de uma medida de cobertura, isto é, a fração ponderada de questões para as quais o programa contém posição suficientemente documentada. Ausências não serão tratadas como concordância nem usadas para penalizar o eleitor.

O mapa bidimensional será uma visualização auxiliar, não um diagnóstico ideológico completo. A coordenada econômica será derivada exclusivamente de afirmações previamente classificadas nesse eixo; a coordenada social/liberdades, de afirmações classificadas nesse segundo eixo. As coordenadas serão médias ponderadas e acompanhadas de um aviso metodológico sobre redução de dimensionalidade.

## Evidências, contexto e linguagem clara

O detalhamento de cada candidato exibirá propostas concretas em áreas de maior e menor alinhamento, acompanhadas de transcrição literal, referência de página e vínculo ao PDF disponibilizado no próprio produto. Fontes acadêmicas revisadas por pares serão empregadas para justificar a escolha dos eixos, as limitações de escalas ideológicas e práticas de elaboração de questionários. Indicadores de contexto serão provenientes prioritariamente de órgãos oficiais e multilaterais com metodologia pública; eles não alterarão a pontuação programática.

O texto personalizado terá uma instrução restritiva: explicará somente padrões calculados, respostas do usuário e trechos catalogados do programa. Ele não poderá introduzir informações externas, previsões, juízos morais ou recomendações de voto. A alternativa determinística terá a mesma restrição e citará as evidências que sustentam cada afirmação.

## Direção visual

A interface adotará uma linguagem editorial cívica contemporânea: fundo marfim suave, azul-profundo como cor estrutural, acento cobre discreto, contrastes compatíveis com WCAG 2.2 AA, serifada de leitura para títulos e sans-serif de alta legibilidade para controles e dados. A navegação será sequencial e clara, com progresso visível, alvos de toque amplos, foco de teclado evidente, gráficos com equivalentes textuais e ausência de animações que prejudiquem pessoas com preferência por movimento reduzido.

