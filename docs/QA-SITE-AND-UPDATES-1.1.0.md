# QA — site institucional e atualizações 1.1.0

## Validações concluídas

| Área | Resultado |
|---|---|
| Landing pública | Revisada em desktop e móvel: contém somente descrição do produto, autoria segura, download Windows e seleção explícita de método Linux. |
| Downloads | Os cinco artefatos finais responderam `206` em requisições de faixa mínima no domínio público. |
| Integridade | Os cinco SHA-256 do arquivo `Stray-Linux-1.1.0-SHA256SUMS.txt` foram validados contra os artefatos finais em `dist`. |
| Feed | `latest.yml` e `latest-linux.yml` usam URLs HTTPS absolutas, tamanhos e SHA-512 gerados pelo empacotador. |
| Atualizador | O executável final inclui `app-update.yml` para `https://linuxtoys-ckuyvpj5.manus.space/updates`; o cliente só instala após confirmação. |
| Qualidade | Testes, checagem de tipos e build de produção concluídos com êxito. |

## Limites declarados

O instalador Windows não possui certificado de assinatura de código configurado nesta versão. O feed verifica os metadados de integridade, mas a assinatura Authenticode continua uma etapa futura. Em Linux, o aplicativo não executa comandos de sistema automaticamente; o gerenciador de pacotes e as permissões continuam sob controle da pessoa usuária.
