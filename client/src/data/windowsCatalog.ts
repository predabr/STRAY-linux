export type WindowsRisk = "safe" | "review" | "administrator";

export type WindowsAction = {
  id: string;
  title: string;
  description: string;
  command?: string;
  steps?: string[];
  risk: WindowsRisk;
  requirement: string;
  warning?: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type WindowsApp = {
  id: string;
  name: string;
  category: string;
  description: string;
  wingetId: string;
  sourceUrl: string;
};

export const windowsActions: WindowsAction[] = [
  {
    id: "winget-status",
    title: "Verificar o WinGet",
    description: "Mostra versão, fontes configuradas e diagnóstico do Windows Package Manager antes de instalar qualquer aplicativo.",
    command: "winget --info",
    risk: "safe",
    requirement: "Windows 10 1809 ou superior, com App Installer disponível.",
    sourceLabel: "Microsoft Learn — WinGet",
    sourceUrl: "https://learn.microsoft.com/en-us/windows/package-manager/winget/",
  },
  {
    id: "winget-sources",
    title: "Atualizar catálogo de pacotes",
    description: "Atualiza as fontes do WinGet sem instalar, remover ou alterar aplicativos.",
    command: "winget source update",
    risk: "safe",
    requirement: "WinGet funcional e acesso à internet.",
    sourceLabel: "Microsoft Learn — WinGet",
    sourceUrl: "https://learn.microsoft.com/en-us/windows/package-manager/winget/",
  },
  {
    id: "system-overview",
    title: "Coletar visão geral do Windows",
    description: "Exibe edição, versão, build e arquitetura para informar diagnóstico e compatibilidade.",
    command: "Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsBuildNumber, CsSystemType",
    risk: "safe",
    requirement: "Abra o PowerShell normal; o comando apenas consulta informações.",
    sourceLabel: "Microsoft Learn — PowerShell",
    sourceUrl: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-computerinfo",
  },
  {
    id: "gpu-overview",
    title: "Consultar GPU e versão de driver",
    description: "Lista o adaptador gráfico e o driver registrado pelo Windows, sem baixar nem atualizar drivers.",
    command: "Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion, AdapterRAM",
    risk: "safe",
    requirement: "Abra o PowerShell normal; confira a versão no site oficial do fabricante antes de atualizar.",
    sourceLabel: "Microsoft Learn — Get-CimInstance",
    sourceUrl: "https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance",
  },
  {
    id: "battery-report",
    title: "Gerar relatório de bateria",
    description: "Cria um relatório HTML local no Desktop; é útil para notebooks, sem alterar plano de energia.",
    command: "powercfg /batteryreport /output \"%USERPROFILE%\\Desktop\\battery-report.html\"",
    risk: "safe",
    requirement: "Use em Prompt de Comando ou PowerShell. O relatório é salvo no Desktop do usuário atual.",
    sourceLabel: "Microsoft Learn — powercfg",
    sourceUrl: "https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/powercfg-command-line-options",
  },
  {
    id: "storage-sense",
    title: "Configurar limpeza de armazenamento",
    description: "Ative o Storage Sense nas Configurações para gerenciar arquivos temporários com revisão visual das opções.",
    steps: ["Abra Configurações > Sistema > Armazenamento.", "Ative Sensor de Armazenamento.", "Revise manualmente as opções de Lixeira e Downloads antes de confirmar."],
    risk: "review",
    requirement: "Windows 10 ou 11; execute somente após revisar os períodos de exclusão.",
    warning: "Downloads não são gerenciados pela configuração padrão. Configurá-los para limpeza pode remover arquivos pessoais antigos.",
    sourceLabel: "Microsoft Support — Storage Sense",
    sourceUrl: "https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/manage-drive-space-with-storage-sense",
  },
  {
    id: "dism-check",
    title: "Verificar integridade da imagem Windows",
    description: "Consulta se a imagem do Windows foi marcada como íntegra, reparável ou não reparável.",
    command: "DISM.exe /Online /Cleanup-Image /CheckHealth",
    risk: "administrator",
    requirement: "Abra Terminal ou Prompt de Comando como administrador.",
    sourceLabel: "Microsoft Learn — Repair a Windows Image",
    sourceUrl: "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image?view=windows-11",
  },
  {
    id: "dism-repair",
    title: "Reparar componentes Windows",
    description: "Usa o Windows Update como fonte padrão para tentar reparar a imagem após diagnóstico de corrupção.",
    command: "DISM.exe /Online /Cleanup-Image /RestoreHealth",
    risk: "administrator",
    requirement: "Abra Terminal ou Prompt de Comando como administrador e mantenha conexão com Windows Update.",
    warning: "Pode levar vários minutos e requer acesso aos arquivos de reparo. Execute somente quando houver sintomas ou diagnóstico de corrupção.",
    sourceLabel: "Microsoft Support — DISM e SFC",
    sourceUrl: "https://support.microsoft.com/en-us/windows/experience/backup-recovery/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system-files",
  },
  {
    id: "sfc-scan",
    title: "Verificar arquivos protegidos do sistema",
    description: "Escaneia arquivos protegidos e tenta restaurar cópias em cache quando há corrupção detectada.",
    command: "sfc /scannow",
    risk: "administrator",
    requirement: "Abra Terminal ou Prompt de Comando como administrador após a etapa DISM quando aplicável.",
    warning: "Não feche o terminal antes de a verificação alcançar 100%.",
    sourceLabel: "Microsoft Support — System File Checker",
    sourceUrl: "https://support.microsoft.com/en-us/windows/experience/backup-recovery/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system-files",
  },
  {
    id: "winget-review-upgrades",
    title: "Revisar atualizações de aplicativos",
    description: "Lista aplicativos com atualização disponível antes de qualquer alteração.",
    command: "winget upgrade",
    risk: "review",
    requirement: "WinGet funcional; examine fornecedor, versão e impacto antes de executar uma atualização individual.",
    warning: "Não use atualizações em lote sem conferir aplicativos de trabalho, drivers e ferramentas com versões fixadas.",
    sourceLabel: "Microsoft Learn — WinGet",
    sourceUrl: "https://learn.microsoft.com/en-us/windows/package-manager/winget/",
  },
];

export const windowsApps: WindowsApp[] = [
  { id: "powertoys", name: "Microsoft PowerToys", category: "Produtividade", description: "Coleção de utilitários da Microsoft para atalhos, janelas, renomeação e produtividade.", wingetId: "Microsoft.PowerToys", sourceUrl: "https://learn.microsoft.com/en-us/windows/powertoys/install" },
  { id: "terminal", name: "Windows Terminal", category: "Sistema", description: "Terminal moderno para PowerShell, Prompt de Comando e perfis de desenvolvimento.", wingetId: "Microsoft.WindowsTerminal", sourceUrl: "https://learn.microsoft.com/en-us/windows/terminal/" },
  { id: "steam", name: "Steam", category: "Gaming", description: "Cliente de jogos; revise a unidade de instalação e as bibliotecas antes de baixar títulos.", wingetId: "Valve.Steam", sourceUrl: "https://store.steampowered.com/about/" },
  { id: "obs", name: "OBS Studio", category: "Criação", description: "Gravação e transmissão de vídeo de código aberto.", wingetId: "OBSProject.OBSStudio", sourceUrl: "https://obsproject.com/" },
  { id: "vlc", name: "VLC media player", category: "Multimídia", description: "Reprodutor multimídia para formatos de áudio e vídeo.", wingetId: "VideoLAN.VLC", sourceUrl: "https://www.videolan.org/vlc/" },
  { id: "7zip", name: "7-Zip", category: "Utilitários", description: "Compactação e extração de arquivos.", wingetId: "7zip.7zip", sourceUrl: "https://www.7-zip.org/" },
  { id: "firefox", name: "Mozilla Firefox", category: "Navegadores", description: "Navegador independente para trabalho e teste de compatibilidade.", wingetId: "Mozilla.Firefox", sourceUrl: "https://www.mozilla.org/firefox/" },
  { id: "gimp", name: "GIMP", category: "Criação", description: "Editor de imagens para tarefas gráficas e captura de conteúdo.", wingetId: "GIMP.GIMP", sourceUrl: "https://www.gimp.org/" },
];

export const riskLabels: Record<WindowsRisk, { label: string; detail: string }> = {
  safe: { label: "Consulta segura", detail: "Não altera configurações nem instala software." },
  review: { label: "Revisão necessária", detail: "Leia as opções antes de confirmar uma alteração." },
  administrator: { label: "Administrador", detail: "Requer terminal elevado e deve ser usado somente quando aplicável." },
};
