# Apoio financeiro e segurança de pagamento

## Estado atual

O Stray Linux **não processa pagamentos**, não publica chave Pix, CPF, QR estático, token, dado bancário ou link de cobrança. A área de apoio permanece apenas informativa até que exista uma conta recebedora verificada de um provedor de pagamentos autorizado, sob responsabilidade de um adulto responsável pela conta.

## Condições obrigatórias para ativação

| Controle | Exigência antes da ativação |
| --- | --- |
| Conta recebedora | Conta de produção verificada em nome de responsável legal ou entidade apta a receber pagamentos. |
| Checkout | Página hospedada pelo provedor; o Stray Linux não recebe dados de pagamento nem constrói QR estático com dado pessoal. |
| Credenciais | Token de acesso e segredo de webhook armazenados somente em variáveis de ambiente no servidor. Nunca em código, GitHub, navegador ou aplicativo desktop. |
| Confirmação | Mudança para “confirmado” somente após validar a assinatura do webhook e consultar o status no provedor. O retorno do navegador não é prova de pagamento. |
| Idempotência | Identificador do evento e da cobrança persistidos para rejeitar notificações repetidas e impedir dupla contabilização. |
| Privacidade | Armazenar somente o mínimo necessário para auditoria técnica; não registrar CPF, código Pix completo, dados bancários ou conteúdo de pagamento. |

## Fluxo permitido

> O usuário inicia uma contribuição voluntária, o servidor cria uma cobrança no provedor, o navegador abre o checkout hospedado e o provedor notifica o endpoint protegido. Somente uma notificação autenticada e o estado confirmado pelo provedor podem atualizar o estado interno.

O retorno ao site pode exibir somente um estado **pendente**. Ele não confirma o recebimento nem altera recursos do aplicativo.

## Referências

Mercado Pago documenta que seus webhooks devem validar a assinatura secreta e que a aplicação pode consultar o pagamento notificado antes de atualizar o estado. [Documentação de Webhooks do Mercado Pago](https://www.mercadopago.com.br/developers/en/docs/your-integrations/notifications/webhooks)

Asaas documenta o uso de um token de autenticação no cabeçalho do webhook e recomenda processamento idempotente para evitar eventos duplicados. [Documentação de Webhooks do Asaas](https://docs.asaas.com/reference/criar-novo-webhook)
