# Resultados persistentes com código de recuperação

## Objetivo e modelo de ameaça

O resultado precisa ser recuperável em outro navegador ou dispositivo sem que o servidor receba as respostas, o ranking em claro ou a chave de leitura. O desenho adotado transforma o resultado em um **cofre cifrado do eleitor**: o navegador cria a chave, cifra o conteúdo e envia somente o pacote cifrado; o servidor armazena o pacote por um identificador opaco; e a pessoa guarda o único código capaz de abrir o resultado.

Esse desenho reduz ao mínimo o dado armazenado, conforme a recomendação de evitar armazenar informação sensível sempre que possível. [1] A API Web Crypto estará disponível somente em contexto seguro (HTTPS), e AES-GCM oferece confidencialidade com autenticação contra modificação do conteúdo. [2] [3]

## Formato do código

O navegador gerará um código com duas partes independentes:

| Parte | Origem | Função | Enviada ao servidor? |
|---|---|---|---|
| Identificador público | 128 bits aleatórios | Localiza o cofre cifrado. | Sim. |
| Segredo de recuperação | 256 bits aleatórios | É importado como chave AES-GCM e nunca sai do navegador. | Não. |

O código exibido terá o formato `BRCP-<identificador>.<segredo>`. Ele deve ser copiado ou guardado pela pessoa. Não funcionará como senha reutilizável, não terá recuperação por e-mail e não poderá ser reemitido: esses limites são necessários porque o aplicativo não guardará a chave de leitura.

## Conteúdo, cifragem e armazenamento

O JSON cifrado conterá a versão da matriz, respostas, pesos, data de criação e o resultado calculado, permitindo que o resultado se mantenha reproduzível mesmo após mudanças futuras de interface. Cada salvamento usará chave AES-GCM de 256 bits e IV aleatório de 96 bits. O identificador e a versão serão adicionados como dados autenticados, impedindo a troca de um pacote entre identificadores sem que a abertura falhe. [2] [3]

O banco receberá somente `id`, `ciphertext`, `iv`, `version`, `createdAt` e `expiresAt`. Não receberá respostas, ranking, nome de candidatura ou código secreto em claro. O registro será imutável e expira após **365 dias**; a pessoa poderá salvar outro resultado se refizer o teste. A recuperação inválida exibirá uma mensagem genérica para não revelar se um identificador existe.

## Limites e comportamento seguro

> O código recupera um resultado, não uma identidade. Quem possuir o código poderá abrir aquele cofre; quem o perder não poderá recuperá-lo.

O modelo protege contra leitura do banco por terceiros sem o segredo, mas não protege contra dispositivo comprometido, extensão maliciosa, captura de tela ou compartilhamento voluntário do código. O usuário será orientado a manter o código fora de redes sociais e a não depender de dados de navegação privada. A opção de salvar será voluntária; continuar sem salvar mantém o comportamento inteiramente efêmero da ferramenta.

## Referências

[1] [OWASP, *Cryptographic Storage Cheat Sheet*](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

[2] [MDN, *SubtleCrypto.encrypt()*](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt)

[3] [NIST SP 800-38D, *Galois/Counter Mode*](https://csrc.nist.gov/pubs/sp/800/38/d/final)
