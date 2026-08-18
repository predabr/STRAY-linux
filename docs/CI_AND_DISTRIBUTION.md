# CI e distribuição

O repositório mantém três verificações complementares. O workflow `Quality` instala o lockfile com pnpm, executa `pnpm audit:security`, `pnpm check`, `pnpm test` e `pnpm build`. O workflow `Security` executa CodeQL para JavaScript/TypeScript e revisão de dependências em pull requests. O workflow `Distribution` executa diariamente a auditoria pública do pacote Arch e também pode ser iniciado manualmente.

## Auditoria Arch

A verificação local usa:

```bash
ALLOW_NON_ARCH=1 pnpm verify:arch-download
```

Em uma instalação Arch real, execute sem `ALLOW_NON_ARCH` para habilitar a inspeção adicional com `pacman -Qp`:

```bash
pnpm verify:arch-download
```

O script não instala o pacote e não altera o sistema. Ele exige redirect HTTP 302 para um artefato da release 1.2.0, baixa o pacote, compara o SHA-256 calculado com o sidecar público, verifica o contêiner gzip usado pelo alvo `pacman` atual do electron-builder e confirma que o arquivo contém `opt/Stray Linux/`. O pacote 1.2.0 final foi revalidado no domínio com 173025951 bytes e SHA-256 `58fb4bd1a4fab00165ccfdc89728ba199e76c6cca7fd4c0701d3f88224fd51ec`. O sandbox não é Arch, portanto a inspeção `pacman -Qp` precisa ser executada pelo colaborador em uma máquina Arch.

## Matriz de validação por formato

| Família | O que foi confirmado no pipeline | Limite declarado ao usuário |
|---|---|---|
| Debian / Ubuntu (`.deb`) | Download estável, sidecar SHA-256 e metadados da release. | A instalação e a abertura final devem ocorrer em sistema da família Debian. |
| Fedora / RHEL / openSUSE (`.rpm`) | Download estável, sidecar SHA-256 e metadados da release. | A instalação e a abertura final devem ocorrer na família RPM compatível. |
| Arch e derivadas (`.pacman`) | Redirect, SHA-256, contêiner do pacote e conteúdo `opt/Stray Linux/`. | `pacman -Qp` exige uma máquina Arch real; não é simulado no sandbox. |
| AppImage | Download estável e sidecar SHA-256. | A abertura depende das permissões e bibliotecas da distribuição local. |
| Windows (`.exe`) | Setup, blockmap, feed e metadados do atualizador. | A assinatura Authenticode ainda requer certificado de assinatura configurado pelo responsável. |

## Canal de atualização

O aplicativo consulta um **feed HTTPS comum**, e somente propõe a atualização quando o artefato compatível é publicado nesse canal. Isso não substitui a escolha correta de formato na instalação inicial: `.deb`, `.rpm`, `.pacman` e AppImage continuam dependentes da família Linux do usuário. Em Arch e derivadas, a confirmação de metadados com `pacman -Qp` permanece uma verificação na máquina real, não uma etapa simulada pelo updater.

## Política de dependências

A auditoria falha em advisories altas ou críticas que tenham mitigação publicada. `esbuild`, `@babel/core`, `tar`, Vite, PostCSS, pnpm, Vitest e Electron são mantidos em versões corrigidas no lockfile quando compatíveis. O advisory de `extract-zip` permanece explicitamente em revisão porque o upstream informa que não há versão corrigida e o caminho identificado é transitivo da cadeia de desenvolvimento do Electron. Essa exceção é exibida pelo auditor; ela não deve ser convertida em silêncio.

## Como atualizar dependências

Atualizações devem ser feitas em branch, com `pnpm install --lockfile-only`, `pnpm audit:security`, `pnpm check`, `pnpm test`, `pnpm build` e, quando o Electron mudar, `pnpm desktop:packages`. Nunca faça commit de `.env`, tokens, diagnósticos locais ou artefatos binários gerados fora do fluxo de distribuição.
