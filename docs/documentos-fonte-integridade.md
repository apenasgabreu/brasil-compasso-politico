# Integridade dos documentos-fonte

Os PDFs usados na matriz são identificados no arquivo versionado [`shared/source-document-integrity.json`](../shared/source-document-integrity.json). Cada registro reúne o nome do arquivo analisado, SHA-256, URL de entrega atual, estado de preservação e o [catálogo oficial DivulgaCandContas do TSE](https://divulgacandcontas.tse.jus.br/divulga/) para conferência eleitoral. Em 19 de agosto de 2026, os 12 PDFs e os inventários foram preservados no item público [Brasil em Perspectiva — Documentos-fonte de programas de governo (2026)](https://archive.org/details/brasil-em-perspectiva-documentos-2026).

O hash permite verificar se uma cópia obtida corresponde exatamente ao arquivo analisado. A URL `/manus-storage/` é apenas um canal de entrega do produto e não é apresentada como arquivo permanente ou substituto da fonte oficial. O pacote preservado possui SHA-256 `c302702fad9e2ba511057020351861c95e3570b1a0a93bac3d8f43e6bce74565`; a cópia oficial eleitoral permanece a referência para confirmar registro e atualização.

Ao substituir um PDF, é obrigatório recalcular seu SHA-256, atualizar a matriz e o changelog metodológico, passar pela revisão de governança e regenerar o manifesto de integridade. O inventário em si integra o conjunto de arquivos protegidos pelo manifesto.
