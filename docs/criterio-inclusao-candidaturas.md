# Critério de inclusão e situação eleitoral

Um programa entra na comparação somente quando há **(a)** um PDF programático recebido e identificado no inventário de documentos e **(b)** uma candidatura presidencial correspondente no conjunto oficial [Candidatos — 2026 do TSE](https://dadosabertos.tse.jus.br/dataset/candidatos-2026). A consulta de referência desta versão foi obtida em 19 de agosto de 2026, e seus identificadores de candidatura estão em [`shared/candidate-registry-2026.json`](../shared/candidate-registry-2026.json).

O campo de situação é apresentado exatamente como disponibilizado no arquivo do TSE. O valor `#NE` não é convertido pelo produto em deferimento, indeferimento ou elegibilidade. A situação deve ser conferida no [DivulgaCandContas](https://divulgacandcontas.tse.jus.br/divulga/) antes de qualquer uso eleitoral da ferramenta, pois o repositório de dados abertos é atualizado e decisões podem mudar.

Programas sem candidatura presidencial correspondente no recorte oficial não entram no ranking. Reciprocamente, uma candidatura existente no TSE sem programa documentado na base não é incluída. Esse critério evita que o produto apresente uma pessoa como candidatura registrada apenas por ter publicado um texto político, ou transforme ausência documental em posição programática.
