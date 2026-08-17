# Manutenção de pacotes: limites de segurança

O Stray Linux deve tratar limpeza de pacotes como **análise local com prévia**, e não como automação silenciosa. A lista apresentada ao usuário precisa ser gerada pelo gerenciador de pacotes detectado e revisada antes de qualquer comando administrativo.

| Família detectada | Leitura local sugerida | Ação que o aplicativo não executa automaticamente |
| --- | --- | --- |
| Arch e derivadas | `pacman -Qdt` para listar órfãos e `pacman -Qm` para pacotes estrangeiros | Remoção recursiva de órfãos, limpeza de cache ou alteração de base de pacotes |
| Debian, Ubuntu e derivadas | `apt-get --simulate autoremove` para mostrar a transação proposta | `apt autoremove`, `purge` ou alteração de fontes |
| Fedora, RHEL e derivadas | `dnf --assumeno autoremove` e `dnf check --duplicates` quando disponíveis | `dnf autoremove`, `dnf clean all` ou transações RPM |

O ArchWiki descreve órfãos como dependências que já não são requeridas, mas alerta que a remoção recursiva pode incluir dependências opcionais; por isso o Stray só pode mostrar a lista e uma recomendação de revisão.[1] A documentação do APT orienta revisar a lista de `autoremove` e marcar manualmente o que deve ser preservado.[2] O DNF documenta `--assumeno` e `check --duplicates` como opções adequadas para prévia e inspeção sem confirmação de transação.[3]

## Referências

[1]: https://wiki.archlinux.org/title/Pacman/Tips_and_tricks "ArchWiki — pacman: Tips and tricks"
[2]: https://manpages.ubuntu.com/manpages/xenial/man8/apt.8.html "Ubuntu Manpage — apt(8)"
[3]: https://dnf.readthedocs.io/en/latest/command_ref.html "DNF Command Reference"
