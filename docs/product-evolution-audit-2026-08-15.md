# Auditoria de evolução do produto — 2026-08-15

## Estado preservado

O Stray Linux já possui uma aplicação web e desktop integrada com GameHub, perfis de jogos, Atlas de distribuições, LinuxFix, Scanner local, biblioteca Steam/Heroic/externa, Stray AI restrito ao domínio do produto, Benchmark, comparação, moderação, sincronização consentida, API pública e instaladores Windows/Linux. O shell desktop usa Electron com `contextIsolation`, `sandbox` e ponte limitada a scanner, biblioteca e seleção explícita de pasta.

## Dados e limites observados

| Área | Estado confirmado | Decisão de evolução |
|---|---:|---|
| Jogos publicados | 10.013 | Manter paginação e não carregar o catálogo inteiro na home. |
| Descrições | 9.985 completas; 10.013 curtas | Exibir apenas o que a origem existente fornece. |
| Capas e mídia publicada | 0 | Usar fallback visual próprio; não importar ou inventar mídia sem licença e proveniência. |
| Benchmarks verificados | Sem amostras publicadas | Exibir ausência útil e preparar visual de telemetria somente para dados reais. |
| Compatibilidade publicada | Sem registros confirmados | Nunca exibir nível, FPS ou recomendação como dado disponível. |
| Distribuições publicadas | 18 | Preservar fontes, famílias e limites por distribuição. |

## Diagnóstico visual

As páginas compartilham uma base técnica coerente, mas a auditoria visual apontou excesso de painéis escuros semelhantes e pouca diferenciação entre catálogo, diagnóstico, benchmark, guias e IA. A evolução deve consolidar uma linguagem de superfícies, metadados monoespaçados, estados de evidência, navegação mais distinta e placeholders de catálogo deliberados — sem depender de imagens de terceiros.

## Guardrails

1. A biblioteca local permanece somente leitura, com seleção explícita de pastas externas e sem julgamento de procedência.
2. O launcher continua limitado ao URI Steam de App IDs locais validados; Heroic e jogos externos não recebem execução arbitrária.
3. O Stray AI não executa comandos, não aceita pedidos fora de Linux gaming/Stray Linux e declara lacunas de evidência.
4. Qualquer benchmark, compatibilidade, mídia, descrição, requisito ou recomendação só aparece com origem e status explícitos.
