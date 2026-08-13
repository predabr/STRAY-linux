# Validação do onboarding Stray Linux

Em 13 de agosto de 2026, a rota inicial foi aberta sem sessão autenticada no navegador de validação. A primeira cena exibiu o texto “Seu PC não é genérico”, o avanço automático percorreu a introdução e a página chegou à tela “Acesso protegido”.

A tela de entrada usa o iniciador OAuth existente do projeto. Ela afirma apenas que a opção Google poderá ser oferecida pelo provedor já conectado; não declara nem implementa um OAuth Google paralelo sem `client_id`, `client_secret` e URI de redirecionamento registrados.

No aplicativo Electron, o hostname local exibe uma continuação explícita para o modo SQLite offline, pois esse modo não depende de banco remoto nem pode prometer login de terceiro fora do fluxo configurado.
