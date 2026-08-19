# Política de Privacidade — Brasil em Perspectiva

**Versão:** 2026.08.19.2 · **Atualizada em:** 19 de agosto de 2026

## Responsável pelo tratamento

O responsável pela ferramenta e controlador dos dados tratados no cofre opcional é **Gabriel Alessandro Marinho Lodi**. Para dúvidas, solicitações ou exercício de direitos relacionados à privacidade, escreva para [gabriellodi@me.com](mailto:gabriellodi@me.com).

## Dados tratados

O questionário funciona por padrão sem conta, perfil, cookie de rastreamento ou persistência automática. Respostas, pesos, ranking e visualizações permanecem na memória da aba enquanto a pessoa usa a ferramenta.

Se a pessoa optar por gerar um código de recuperação, o navegador cifra localmente um pacote contendo respostas, pesos e resultado. O servidor recebe e armazena somente identificador opaco, ciphertext, IV, versão e datas. O segredo necessário para abrir o cofre não é enviado ao servidor. Como opiniões políticas são dados pessoais sensíveis, o conteúdo cifrado é tratado com cautela como **dado pessoal sensível pseudonimizado**, não como dado anonimizado.

## Finalidade, base e retenção

O cofre existe exclusivamente para recuperar, por escolha da própria pessoa, um resultado em outro momento ou dispositivo. A ação de gerar o cofre é voluntária e corresponde ao consentimento para essa finalidade específica. O conteúdo cifrado expira após 365 dias. A pessoa pode deixar de usar o cofre a qualquer momento; a ferramenta não oferece recuperação do segredo perdido.

Para proteger disponibilidade, o serviço mantém por janela de uma hora um identificador HMAC de origem de rede e contadores de quota. Não grava IPs em claro nessa tabela. A infraestrutura de hospedagem pode gerar logs técnicos de acesso, como IP, data, agente de usuário e erros, conforme suas próprias políticas; esses logs não fazem parte do conteúdo do questionário e não são usados para inferir posição política.

## Compartilhamento e terceiros

O compartilhamento de resultado, inclusive Story, é iniciado voluntariamente no dispositivo da pessoa. A aplicação não envia respostas individuais a redes sociais. A hospedagem, o banco do cofre e a entrega estática são fornecidos pela infraestrutura Manus; o código-fonte e a documentação são públicos no GitHub. Documentos eleitorais e dados de candidatura são conferidos em fontes oficiais do TSE.

## Direitos e segurança

Você pode solicitar informações, correção ou esclarecimentos pelo canal de contato acima. Como o cofre não contém identidade, a localização de um registro depende do identificador incluído no código de recuperação. Nunca envie o código secreto por e-mail ou rede social. A criptografia reduz o risco de leitura indevida do banco, mas não protege contra dispositivo comprometido, extensões maliciosas, captura de tela ou compartilhamento voluntário do código.

Esta política descreve a operação atual do produto e deve ser revista quando houver alteração de hospedagem, retenção, integrações, coleta ou funcionalidade.
