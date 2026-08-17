# Contribuindo

Contribuições são bem-vindas quando preservam a regra central do projeto: **não inventar dados de compatibilidade, FPS, reviews ou fontes**.

## Ambiente local

Instale Node.js 22 e pnpm 10, copie a configuração de banco apropriada para o ambiente e execute:

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

Antes de abrir uma alteração, execute `pnpm check`, `pnpm test` e `pnpm build`. Para alterações de schema, gere a migration, revise o SQL e aplique-a no banco de desenvolvimento pelo fluxo de migrations. Alterações na ponte Electron, no atualizador, em comandos de pacote ou na importação de arquivos devem acrescentar regressão específica e nunca ampliar permissões por conveniência.

## Dados e conteúdo

Inclua uma fonte para qualquer novo benchmark, compatibilidade, guia, solução LinuxFix ou artigo. Benchmarks enviados pela comunidade devem preservar hardware, distro, driver, runtime, resolução, preset e evidência. Não introduza dados de FPS de exemplo, avaliações falsas ou títulos inventados.

## Pull requests

Explique o problema resolvido, o impacto em proveniência e os testes executados. Alterações de UI devem manter navegação por teclado, contraste, estados de carregamento/erro/vazio e responsividade. Para conteúdo técnico, identifique a distribuição e versão afetadas. Consulte [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`SECURITY.md`](SECURITY.md) e [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) antes de abrir uma contribuição ampla.
