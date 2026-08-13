# Fontes de hardware, drivers e distribuição

## Uso no Stray Linux

Estas fontes sustentam identificação, exibição e validação de ambiente. Elas não autorizam inferir suporte de jogo, desempenho, VRAM ou versão instalada quando o campo não está presente no relatório do usuário ou em uma fonte registrada.

| Domínio | Fonte | Formato/campo permitido | Licença, termos e frequência |
| --- | --- | --- | --- |
| Identificação PCI | [PCI ID Repository][1] | Snapshot `pci.ids` para IDs de fornecedor, dispositivo, subsistema e classe. | O repositório informa distribuição sob GPL v2+ **ou** BSD-3-Clause. Se a ingestão for automatizada, usar `User-Agent` identificável, compressão, cache e baixa frequência; não consultar centenas de vezes ao dia. |
| Distro e versão local | [systemd os-release][2] | Leitura local de `ID`, `NAME`/`PRETTY_NAME`, `VERSION_ID` e, quando disponível, `ID_LIKE`. | Especificação de identificação, não catálogo remoto. O scanner lê somente `/etc/os-release`; não combina esse arquivo com `/usr/lib/os-release` quando o primeiro existe. |
| Drivers AMD e Intel no kernel | [Linux GPU Driver Documentation][3] | Referência técnica de drivers DRM como `amdgpu`, `i915` e `xe`. | Documentação primária do kernel; não fornece um feed de versão instalada. Versões reais são obtidas somente do ambiente local ou de fonte específica registrada. |
| Driver NVIDIA Unix/Linux | [NVIDIA Unix Driver Archive][4] | Ramo e versão publicados para Linux por arquitetura, com URLs de detalhes/arquivo. | Página oficial de distribuição. Manter somente referência de release e data de coleta; instalação continua seguindo a documentação da distribuição do usuário. |

> O formato `os-release` é uma lista de atribuições compatíveis com shell, mas aplicações não devem executar seu conteúdo como shell. O scanner do Stray Linux interpreta somente pares simples e ignora recursos de shell, evitando execução de dados locais não confiáveis [2].

## Política de atualização

O projeto não agenda essas fontes até a publicação da rota de produção e aprovação da frequência. Quando habilitada, a rotina deverá ser idempotente, conservar URL, hash, horário e resultado em `source_refresh_runs`; respeitar cache e termos da fonte; e nunca converter referências upstream em alegações de disponibilidade em toda distro.

## Referências

[1]: https://pci-ids.ucw.cz/ "PCI ID Repository"
[2]: https://www.freedesktop.org/software/systemd/man/os-release.html "systemd os-release"
[3]: https://docs.kernel.org/gpu/drivers.html "Linux GPU Driver Documentation"
[4]: https://www.nvidia.com/en-us/drivers/unix/ "NVIDIA Unix Driver Archive"
