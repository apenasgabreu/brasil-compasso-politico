# Política de segurança

## Reportar uma vulnerabilidade

Não abra issue pública para relatar vulnerabilidades que possam expor respostas, códigos de recuperação, cofres cifrados, chaves, tokens ou infraestrutura. Use o recurso de **Security Advisories** do repositório no GitHub para enviar um relato privado com passos de reprodução, impacto esperado e, se possível, uma proposta de correção.

O projeto prioriza correções que preservem o princípio de que o segredo de recuperação nunca deixa o navegador. Não inclua um código de recuperação real em relatórios.

## Escopo de segurança

O recurso de resultado persistente usa cifra no navegador e armazenamento apenas do envelope cifrado. Ele não substitui proteção contra dispositivo comprometido, extensão maliciosa, captura de tela ou compartilhamento voluntário do código. Consulte [resultados-persistentes-cifrados.md](docs/resultados-persistentes-cifrados.md) para detalhes técnicos e limites.

## Boas práticas para quem usa a ferramenta

Guarde o código de recuperação em local privado, não o publique em redes sociais e não o envie a terceiros. Caso o código seja perdido, não há mecanismo de recuperação intencionalmente.
