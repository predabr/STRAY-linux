# Instalação e privilégios do Stray Linux

## Princípio de privilégio mínimo

O instalador e o aplicativo têm responsabilidades distintas. A instalação Windows agora é configurada em escopo por máquina e solicita confirmação UAC para gravar no local de instalação do sistema. Depois de instalado, **Stray Linux, Stray Scan e a biblioteca local devem ser executados como o usuário normal**. O Scanner não executa comandos de correção, não altera drivers, não usa `sudo` e não precisa de administrador para gerar o relatório técnico.

| Formato | Privilégio no momento da instalação | Execução do aplicativo |
| --- | --- | --- |
| `Setup.exe` | Solicita UAC para instalação por máquina. | Usuário normal. |
| `.deb` | O gerenciador de pacotes exige privilégio administrativo. | Usuário normal. |
| `.rpm` | O gerenciador de pacotes exige privilégio administrativo. | Usuário normal. |
| `.pacman` | O gerenciador de pacotes exige privilégio administrativo. | Usuário normal. |
| `AppImage` | Não exige administrador; é portátil. | Usuário normal. |

> O aplicativo não solicita elevação para consultar hardware. Quando uma leitura não estiver disponível sem privilégios, o relatório a mostra como não informada em vez de pedir acesso elevado ou inventar um valor.

## Limites verificados

O instalador Windows não inclui assinatura de código neste pipeline local. A confirmação UAC indica o escopo de instalação, mas não substitui uma assinatura de publicador em uma distribuição pública. Os checksums SHA-256 publicados com cada build devem ser usados para conferir a integridade do arquivo baixado antes da instalação.
