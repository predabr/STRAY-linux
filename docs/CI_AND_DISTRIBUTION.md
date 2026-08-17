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

O script não instala o pacote e não altera o sistema. Ele exige redirect HTTP 302 para um artefato da release 1.2.0, baixa o pacote, compara o SHA-256 calculado com o sidecar público, verifica o contêiner gzip usado pelo alvo `pacman` atual do electron-builder e confirma que o arquivo contém `opt/Stray Linux/`. O pacote 1.2.0 gerado localmente tem 173026370 bytes e SHA-256 `8286cc23716650719b9199d74af9c1f61afc7f758e9b87421054c361699f97eb`; esses valores serão revalidados pelo script no domínio publicado. O sandbox não é Arch, portanto a inspeção `pacman -Qp` precisa ser executada pelo colaborador em uma máquina Arch.

## Política de dependências

A auditoria falha em advisories altas ou críticas que tenham mitigação publicada. `esbuild`, `@babel/core`, `tar`, Vite, PostCSS, pnpm, Vitest e Electron são mantidos em versões corrigidas no lockfile quando compatíveis. O advisory de `extract-zip` permanece explicitamente em revisão porque o upstream informa que não há versão corrigida e o caminho identificado é transitivo da cadeia de desenvolvimento do Electron. Essa exceção é exibida pelo auditor; ela não deve ser convertida em silêncio.

## Como atualizar dependências

Atualizações devem ser feitas em branch, com `pnpm install --lockfile-only`, `pnpm audit:security`, `pnpm check`, `pnpm test`, `pnpm build` e, quando o Electron mudar, `pnpm desktop:packages`. Nunca faça commit de `.env`, tokens, diagnósticos locais ou artefatos binários gerados fora do fluxo de distribuição.
