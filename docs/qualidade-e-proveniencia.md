# Qualidade contínua e proveniência de build

O workflow `quality-and-integrity` combina testes unitários, tipagem, build, verificação da matriz, testes e2e em Chromium e auditoria automática de acessibilidade com axe-core. Os testes e2e cobrem a introdução e a rota pública `/metodo`, incluindo navegação por teclado, hierarquia principal de títulos, contraste detectável e regras WCAG automáticas.

## Atestação de build

Em cada `push` na `main`, o CI empacota `dist/` como `brasil-em-perspectiva-build.tgz`, publica o artefato por 30 dias e cria uma atestação de proveniência SLSA usando `actions/attest@v4`. A atestação vincula o digest do arquivo ao repositório, workflow e commit que o produziram, com certificado Sigstore efêmero. Pull requests executam qualidade e e2e, mas não publicam artefatos nem atestações.

Para verificar o artefato baixado do run correspondente, use:

```bash
gh attestation verify brasil-em-perspectiva-build.tgz \
  --repo apenasgabreu/brasil-compasso-politico
```

> A atestação prova a origem do artefato do CI do GitHub. Ela não substitui a verificação da matriz SHA-256, a revisão humana das fontes ou a relação operacional entre o artefato do CI e o deploy da plataforma.

## Evidências de falha e retenção

Quando o job Playwright falha, os relatórios, imagens e traces de teste são publicados por 14 dias para diagnóstico. O pacote de produção atestado permanece disponível como artefato por 30 dias. Esses arquivos não recebem respostas de participantes; os testes usam somente a jornada pública vazia.

## Referências

[1]: https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds "GitHub Docs — artifact attestations"
[2]: https://github.com/actions/attest "actions/attest"
