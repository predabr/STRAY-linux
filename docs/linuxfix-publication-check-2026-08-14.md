# Verificação pós-publicação — LinuxFix

## Registro inicial

Após o checkpoint `31a09f69`, o domínio público respondeu e carregou a rota `/linuxfix/proton-game-does-not-start`. Na primeira janela de verificação, a navegação ainda exibia o bundle anterior da tela LinuxFix, sem o novo mapa de diagnóstico, etapas classificadas e contribuição moderada. O fato foi registrado como **propagação pendente**, não como ausência de publicação, pois a rota e a aplicação responderam normalmente.

## Critérios para a rechecagem

A versão publicada será considerada confirmada quando a rota pública exibir o título real do runbook, o painel de contexto técnico, o mapa de diagnóstico, as etapas com estado/riscos/verificação/reversão e o bloco de contribuição moderada.

## Rechecagem

Uma nova consulta com parâmetro de versão ainda observou o bundle anterior durante a propagação, apesar de a rota continuar acessível. Logo após a consulta, a plataforma confirmou a conclusão do deploy do domínio. O checkpoint contém a implementação validada localmente; a rechecagem externa pode ser repetida após a invalidação natural do cache de entrega.
