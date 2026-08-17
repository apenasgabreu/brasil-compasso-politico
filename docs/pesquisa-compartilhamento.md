# Compartilhamento social e privacidade

O mecanismo recomendado para resultados privados é a **Web Share API**, acionada somente por gesto explícito do usuário. A documentação da MDN informa que `navigator.share()` abre o mecanismo nativo de compartilhamento do dispositivo e pode encaminhar texto, URL e arquivos aos destinos escolhidos pelo próprio usuário. `navigator.canShare()` permite verificar previamente se o navegador aceita o conteúdo, inclusive arquivos. [1] [2]

Para stories, a aplicação web não deve prometer publicação direta no Instagram. A documentação da Meta sobre “Sharing to Stories” descreve integração para aplicativos nativos Android e iOS, e não uma publicação automatizada a partir de uma página web. Assim, a implementação adequada é gerar localmente uma imagem de resultado e abrir a folha nativa de compartilhamento em dispositivos compatíveis. Se Instagram estiver instalado e for oferecido pelo sistema, o eleitor poderá escolhê-lo e publicar em Story; se não estiver, poderá baixar a imagem ou copiar um texto resumido. [3]

Nenhuma resposta individual será transmitida à aplicação. A imagem e o texto compartilhados serão gerados no navegador e conterão somente o resumo que o eleitor vê e decide compartilhar, junto do aviso de que se trata de afinidade programática, não recomendação de voto.

## Referências

[1] MDN Web Docs. “Navigator: share() method.” <https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share>

[2] MDN Web Docs. “Navigator: canShare() method.” <https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare>

[3] Meta for Developers. “Sharing to Stories.” <https://developers.facebook.com/documentation/instagram-platform/sharing-to-stories>
