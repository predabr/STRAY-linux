# Apoio financeiro e segurança de pagamento

## Estado atual

O Stray Linux **não processa pagamentos** e não publica token, dado bancário ou link de cobrança. O QR Pix manual permanece desativado até que `PIX_STATIC_KEY`, `PIX_MERCHANT_NAME` e `PIX_MERCHANT_CITY` sejam configurados exclusivamente no ambiente do servidor. Sem essas variáveis, a área de apoio informa que o canal manual está indisponível e não renderiza QR, chave ou payload. A cobrança dinâmica exige um **provedor de pagamentos autorizado**.

## Condições obrigatórias para ativação

| Controle | Exigência antes da ativação |
| --- | --- |
| Conta recebedora | Conta de produção verificada em nome de responsável legal ou entidade apta a receber pagamentos. |
| Checkout | Página hospedada pelo provedor; o Stray Linux não recebe dados de pagamento nem constrói QR estático com dado pessoal. |
| Credenciais | Token de acesso e segredo de webhook armazenados somente em variáveis de ambiente no servidor. Nunca em código, GitHub, navegador ou aplicativo desktop. |
| QR estático opcional | `PIX_STATIC_KEY`, `PIX_MERCHANT_NAME`, `PIX_MERCHANT_CITY` e `PIX_TRANSACTION_ID` ficam apenas no servidor. O aplicativo recebe somente o SVG do QR gerado a partir de um BR Code já validado quando essa configuração está completa; não recebe a chave nem o payload em texto. |
| Confirmação | Mudança para “confirmado” somente após validar a assinatura do webhook e consultar o status no provedor. O retorno do navegador não é prova de pagamento. |
| Idempotência | Identificador do evento e da cobrança persistidos para rejeitar notificações repetidas e impedir dupla contabilização. |
| Privacidade | Armazenar somente o mínimo necessário para auditoria técnica; não registrar CPF, código Pix completo, dados bancários ou conteúdo de pagamento. |

## Variáveis de ambiente do QR manual

| Variável | Uso | Regra |
| --- | --- | --- |
| `PIX_STATIC_KEY` | Chave usada somente para montar o BR Code no backend. | Obrigatória para exibir QR; nunca vai para bundle, HTML ou resposta textual da API. |
| `PIX_MERCHANT_NAME` | Nome do recebedor no BR Code. | Obrigatória; normalizada e limitada a 25 caracteres. |
| `PIX_MERCHANT_CITY` | Cidade do recebedor no BR Code. | Obrigatória; normalizada e limitada a 15 caracteres. |
| `PIX_TRANSACTION_ID` | TXID estático de conciliação. | Opcional; usa `***` se não configurado e não confirma pagamento. |

Essas variáveis já são ignoradas pelos padrões `.env*` do repositório. Sem os três campos obrigatórios, o endpoint retorna somente `unavailable` e a interface não mostra QR.

## Fluxo permitido

> O usuário inicia uma contribuição voluntária, o servidor cria uma cobrança no provedor, o navegador abre o checkout hospedado e o provedor notifica o endpoint protegido. Somente uma notificação autenticada e o estado confirmado pelo provedor podem atualizar o estado interno.

O retorno ao site pode exibir somente um estado **pendente**. Ele não confirma o recebimento nem altera recursos do aplicativo.

## Integração dinâmica futura

Uma integração dinâmica só será ativada com variáveis de ambiente de um provedor autorizado, incluindo token de produção e segredo de webhook. O webhook deve validar a assinatura do provedor, consultar o estado canônico da cobrança e persistir o identificador do evento antes de qualquer contabilização. A operação precisa ser idempotente: um mesmo `providerEventId` não pode ser aceito duas vezes. Nenhum desses controles está ativo sem provedor configurado.

## Referências

Mercado Pago documenta que seus webhooks devem validar a assinatura secreta e que a aplicação pode consultar o pagamento notificado antes de atualizar o estado. [Documentação de Webhooks do Mercado Pago](https://www.mercadopago.com.br/developers/en/docs/your-integrations/notifications/webhooks)

Asaas documenta o uso de um token de autenticação no cabeçalho do webhook e recomenda processamento idempotente para evitar eventos duplicados. [Documentação de Webhooks do Asaas](https://docs.asaas.com/reference/criar-novo-webhook)
