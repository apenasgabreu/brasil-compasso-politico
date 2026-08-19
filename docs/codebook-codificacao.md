# Codebook de codificação programática

Este codebook descreve a régua operacional da matriz em `shared/compassPositions.json`. Ele não substitui revisão independente: a versão atual foi produzida sob codificação inicial única e deve receber auditoria de segundo codificador em amostra pública antes de qualquer alegação de confiabilidade intercodificadores.

## Unidade de codificação

Cada célula vincula **uma afirmação do questionário** a uma passagem do programa da candidatura. A codificação usa somente o PDF indicado no inventário documental. Filiação partidária, entrevistas, votações, biografias e avaliações externas não suprem uma lacuna do documento.

| Valor | Regra operacional |
| --- | --- |
| `+2` | O texto sustenta de modo explícito e substantivo a direção integral da afirmação. |
| `+1` | O texto sustenta a direção geral, mas com escopo, intensidade ou mecanismo mais limitado. |
| `0` | O texto sustenta posição intermediária, condicionada ou simultaneamente favorável a direções opostas. |
| `-1` | O texto contraria a direção geral, mas em escopo, intensidade ou mecanismo limitados. |
| `-2` | O texto contraria de modo explícito e substantivo a direção integral da afirmação. |
| `null` | O programa é silencioso, vago, contraditório, não trata do item ou não permite inferência sem salto interpretativo. |

## Confiança documental

| Confiança | Uso permitido |
| --- | --- |
| `0,9` | Citação direta, específica e inequívoca sobre o mecanismo ou objetivo do item. |
| `0,8` | Citação direta que sustenta a posição, com escopo menor ou linguagem programática mais ampla. |
| Abaixo de `0,8` | Não é usada pela matriz atual. Em vez de inventar precisão, o item deve ser reavaliado para posição menos intensa ou `null`. |

## Regras de revisão

Uma revisão documental pode corrigir nome, URL, página, transcrição ou metadado sem alterar a posição. Uma revisão interpretativa deve indicar a célula, a citação anterior, a citação revisada, a justificativa e o impacto no resultado. Mudanças estruturais — novos itens, alteração de direção normativa, pesos, limiares ou algoritmo — exigem versão de matriz, changelog e revisão de governança.

Para auditoria independente, a amostra deve ser estratificada por candidatura, eixo, intensidade (`±1` e `±2`) e confiança. Discordâncias devem registrar a decisão de cada codificador antes da resolução; uma medida como alfa de Krippendorff só poderá ser publicada depois de coleta independente suficiente.

## Dupla codificação iniciada

O projeto agora mantém uma folha cega para o segundo codificador em `review/double-coding/reviewer-2-blind-template.json`. Ela inclui todas as 600 células da matriz, o enunciado, o PDF e seu SHA-256, mas omite posição, confiança, citação e página da primeira codificação. O protocolo, a métrica de concordância e o log de reconciliação estão documentados em `review/double-coding/README.md`.
