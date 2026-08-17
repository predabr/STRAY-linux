import type { Locale } from "@/contexts/LanguageContext";

type LandingCard = { number: string; tag: string; title: string; copy: string; tone: "lime" | "violet" | "blue" };
type EvidenceCard = { title: string; copy: string };

type LandingCopy = {
  station: string; eyebrow: string; heroMain: string; heroAccent: string; heroBody: string; chooseFormat: string;
  statusLocal: string; scannerValue: string; libraryValue: string; evidenceValue: string; viewPrinciples: string;
  methodEyebrow: string; methodLead: string; methodMain: string; methodAccent: string; cards: LandingCard[]; marquee: string;
  downloadsEyebrow: string; downloadsLead: string; downloadsMain: string; downloadsAccent: string; uninstallLead: string;
  windowsEyebrow: string; windowsMain: string; windowsAccent: string; windowsBody: string; downloadExe: string; windowsFootnote: string;
  evidenceEyebrow: string; evidenceMain: string; evidenceAccent: string; evidenceBody: string; evidenceCards: EvidenceCard[];
  footerCreator: string; footerUninstall: string;
};

const cards = (system: string, games: string, fix: string): LandingCard[] => [
  { number: "01", tag: system, title: "", copy: "", tone: "lime" },
  { number: "02", tag: games, title: "", copy: "", tone: "violet" },
  { number: "03", tag: fix, title: "", copy: "", tone: "blue" },
];

const landingCopySource: Record<Locale, LandingCopy> = {
  "pt-BR": {
    station: "ESTAÇÃO DE INTELIGÊNCIA PARA LINUX GAMING", eyebrow: "SEU AMBIENTE. LIDO COM CLAREZA.", heroMain: "Jogue Linux.", heroAccent: "Sem escuro.", heroBody: "Uma camada local para entender sistema, jogos e compatibilidade antes de tomar decisões. Sem números inventados. Sem ações escondidas.", chooseFormat: "Escolher formato",
    statusLocal: "STATUS LOCAL", scannerValue: "Sob demanda", libraryValue: "Leitura local", evidenceValue: "Declarada", viewPrinciples: "VER PRINCÍPIOS",
    methodEyebrow: "O MÉTODO / 03 CAMADAS", methodLead: "O Stray Linux transforma sinais técnicos em decisões legíveis, mantendo o comando final com você.", methodMain: "Ferramentas que", methodAccent: "explicam antes de agir.", cards: [
      { ...cards("SISTEMA", "JOGOS", "CORREÇÃO")[0], title: "Leia o que o PC diz.", copy: "Scanner, drivers, sessão gráfica e runtimes. Tudo começa na máquina, não em uma suposição." },
      { ...cards("SISTEMA", "JOGOS", "CORREÇÃO")[1], title: "Entenda antes de abrir.", copy: "Contexto para Steam, Heroic, Proton e bibliotecas locais, com limites e fontes declarados." },
      { ...cards("SISTEMA", "JOGOS", "CORREÇÃO")[2], title: "Aja com contexto.", copy: "LinuxFix organiza sintomas, riscos e ações. Nenhum comando é aplicado sem sua confirmação." },
    ], marquee: "LOCAL. EXPLÍCITO. VERIFICÁVEL.",
    downloadsEyebrow: "DOWNLOADS VERIFICÁVEIS / V1.1.10", downloadsLead: "Selecione a família correta. O comando completo baixa o pacote, valida o checksum e instala apenas aquele formato.", downloadsMain: "Pronto para", downloadsAccent: "a sua máquina.", uninstallLead: "Já instalou o aplicativo? Veja o desinstalador por plataforma.",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "Instalador oficial", windowsAccent: ".EXE", windowsBody: "Baixe o instalador NSIS oficial. Confirme o SHA-256 publicado antes de executar.", downloadExe: "Baixar .EXE", windowsFootnote: "Atualizações controladas são verificadas no aplicativo instalado.",
    evidenceEyebrow: "O QUE O STRAY DECLARA", evidenceMain: "Dados técnicos", evidenceAccent: "com contexto.", evidenceBody: "Cada área informa origem, limite e próximo passo. Quando não existe evidência suficiente, o aplicativo mostra indisponibilidade em vez de criar uma resposta.", evidenceCards: [{ title: "Local por padrão", copy: "Scanner, biblioteca e histórico ficam neste computador até uma ação explícita." }, { title: "Fontes visíveis", copy: "Guias e registros exibem proveniência; o catálogo não é uma cópia em tempo real da Steam." }, { title: "Ação revisável", copy: "Comandos são apresentados para revisão; o Stray não muda o sistema silenciosamente." }],
    footerCreator: "Criado por Pedro, Brasil.", footerUninstall: "Desinstalação",
  },
  en: {
    station: "LINUX GAMING INTELLIGENCE STATION", eyebrow: "YOUR ENVIRONMENT. READ CLEARLY.", heroMain: "Play Linux.", heroAccent: "Without guesswork.", heroBody: "A local layer to understand your system, games, and compatibility before making decisions. No invented numbers. No hidden actions.", chooseFormat: "Choose format",
    statusLocal: "LOCAL STATUS", scannerValue: "On demand", libraryValue: "Local read", evidenceValue: "Declared", viewPrinciples: "VIEW PRINCIPLES",
    methodEyebrow: "THE METHOD / 03 LAYERS", methodLead: "Stray Linux turns technical signals into readable decisions while keeping the final command with you.", methodMain: "Tools that", methodAccent: "explain before acting.", cards: [
      { ...cards("SYSTEM", "GAMES", "FIX")[0], title: "Read what your PC says.", copy: "Scanner, drivers, graphics session and runtimes. Everything begins on the machine, not with a guess." },
      { ...cards("SYSTEM", "GAMES", "FIX")[1], title: "Understand before launching.", copy: "Context for Steam, Heroic, Proton and local libraries, with declared limits and sources." },
      { ...cards("SYSTEM", "GAMES", "FIX")[2], title: "Act with context.", copy: "LinuxFix organizes symptoms, risks and actions. No command runs without your confirmation." },
    ], marquee: "LOCAL. EXPLICIT. VERIFIABLE.",
    downloadsEyebrow: "VERIFIABLE DOWNLOADS / V1.1.10", downloadsLead: "Choose the right family. The complete command downloads the package, verifies its checksum and installs only that format.", downloadsMain: "Ready for", downloadsAccent: "your machine.", uninstallLead: "Already installed it? See the uninstaller by platform.",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "Official", windowsAccent: ".EXE installer", windowsBody: "Download the official NSIS installer. Confirm the published SHA-256 before running it.", downloadExe: "Download .EXE", windowsFootnote: "Controlled updates are checked in the installed application.",
    evidenceEyebrow: "WHAT STRAY DECLARES", evidenceMain: "Technical data", evidenceAccent: "with context.", evidenceBody: "Each area states its origin, limit and next step. When evidence is insufficient, the app shows unavailability instead of making up an answer.", evidenceCards: [{ title: "Local by default", copy: "Scanner, library and history stay on this computer until an explicit action." }, { title: "Visible sources", copy: "Guides and records display provenance; the catalog is not a real-time Steam copy." }, { title: "Reviewable action", copy: "Commands are presented for review; Stray never changes the system silently." }],
    footerCreator: "Created by Pedro, Brazil.", footerUninstall: "Uninstall",
  },
  es: {
    station: "ESTACIÓN DE INTELIGENCIA PARA LINUX GAMING", eyebrow: "TU ENTORNO. LEÍDO CON CLARIDAD.", heroMain: "Juega en Linux.", heroAccent: "Sin adivinar.", heroBody: "Una capa local para entender sistema, juegos y compatibilidad antes de decidir. Sin números inventados. Sin acciones ocultas.", chooseFormat: "Elegir formato",
    statusLocal: "ESTADO LOCAL", scannerValue: "Bajo demanda", libraryValue: "Lectura local", evidenceValue: "Declarada", viewPrinciples: "VER PRINCIPIOS",
    methodEyebrow: "EL MÉTODO / 03 CAPAS", methodLead: "Stray Linux convierte señales técnicas en decisiones legibles y mantiene el comando final contigo.", methodMain: "Herramientas que", methodAccent: "explican antes de actuar.", cards: [
      { ...cards("SISTEMA", "JUEGOS", "CORRECCIÓN")[0], title: "Lee lo que dice tu PC.", copy: "Escáner, controladores, sesión gráfica y runtimes. Todo empieza en la máquina, no en una suposición." },
      { ...cards("SISTEMA", "JUEGOS", "CORRECCIÓN")[1], title: "Entiende antes de abrir.", copy: "Contexto para Steam, Heroic, Proton y bibliotecas locales, con límites y fuentes declarados." },
      { ...cards("SISTEMA", "JUEGOS", "CORRECCIÓN")[2], title: "Actúa con contexto.", copy: "LinuxFix organiza síntomas, riesgos y acciones. Ningún comando se aplica sin confirmación." },
    ], marquee: "LOCAL. EXPLÍCITO. VERIFICABLE.",
    downloadsEyebrow: "DESCARGAS VERIFICABLES / V1.1.10", downloadsLead: "Elige la familia correcta. El comando descarga el paquete, verifica el checksum e instala solo ese formato.", downloadsMain: "Listo para", downloadsAccent: "tu máquina.", uninstallLead: "¿Ya instalaste la aplicación? Consulta el desinstalador por plataforma.",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "Instalador oficial", windowsAccent: ".EXE", windowsBody: "Descarga el instalador NSIS oficial. Confirma el SHA-256 publicado antes de ejecutarlo.", downloadExe: "Descargar .EXE", windowsFootnote: "Las actualizaciones controladas se verifican en la aplicación instalada.",
    evidenceEyebrow: "LO QUE STRAY DECLARA", evidenceMain: "Datos técnicos", evidenceAccent: "con contexto.", evidenceBody: "Cada área indica origen, límite y siguiente paso. Si no hay evidencia suficiente, la aplicación muestra indisponibilidad.", evidenceCards: [{ title: "Local por defecto", copy: "Escáner, biblioteca e historial permanecen en este equipo hasta una acción explícita." }, { title: "Fuentes visibles", copy: "Guías y registros muestran procedencia; el catálogo no es una copia de Steam en tiempo real." }, { title: "Acción revisable", copy: "Los comandos se presentan para revisar; Stray no cambia el sistema en silencio." }],
    footerCreator: "Creado por Pedro, Brasil.", footerUninstall: "Desinstalación",
  },
  fr: {
    station: "STATION D’INTELLIGENCE POUR LE GAMING LINUX", eyebrow: "VOTRE ENVIRONNEMENT. LU CLAIREMENT.", heroMain: "Jouez sous Linux.", heroAccent: "Sans deviner.", heroBody: "Une couche locale pour comprendre système, jeux et compatibilité avant de décider. Sans chiffres inventés. Sans actions cachées.", chooseFormat: "Choisir le format",
    statusLocal: "ÉTAT LOCAL", scannerValue: "À la demande", libraryValue: "Lecture locale", evidenceValue: "Déclarée", viewPrinciples: "VOIR LES PRINCIPES",
    methodEyebrow: "LA MÉTHODE / 03 COUCHES", methodLead: "Stray Linux transforme les signaux techniques en décisions lisibles tout en vous laissant la commande finale.", methodMain: "Des outils qui", methodAccent: "expliquent avant d’agir.", cards: [
      { ...cards("SYSTÈME", "JEUX", "CORRECTION")[0], title: "Lisez ce que dit le PC.", copy: "Scanner, pilotes, session graphique et runtimes. Tout commence sur la machine, pas par une hypothèse." },
      { ...cards("SYSTÈME", "JEUX", "CORRECTION")[1], title: "Comprenez avant de lancer.", copy: "Contexte Steam, Heroic, Proton et bibliothèques locales avec limites et sources déclarées." },
      { ...cards("SYSTÈME", "JEUX", "CORRECTION")[2], title: "Agissez avec contexte.", copy: "LinuxFix organise symptômes, risques et actions. Aucune commande sans confirmation." },
    ], marquee: "LOCAL. EXPLICITE. VÉRIFIABLE.",
    downloadsEyebrow: "TÉLÉCHARGEMENTS VÉRIFIABLES / V1.1.10", downloadsLead: "Choisissez la bonne famille. La commande télécharge le paquet, vérifie le checksum et installe uniquement ce format.", downloadsMain: "Prêt pour", downloadsAccent: "votre machine.", uninstallLead: "Déjà installé ? Consultez le désinstallateur par plateforme.",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "Installateur officiel", windowsAccent: ".EXE", windowsBody: "Téléchargez l’installateur NSIS officiel. Confirmez le SHA-256 publié avant exécution.", downloadExe: "Télécharger .EXE", windowsFootnote: "Les mises à jour contrôlées sont vérifiées dans l’application installée.",
    evidenceEyebrow: "CE QUE STRAY DÉCLARE", evidenceMain: "Données techniques", evidenceAccent: "avec contexte.", evidenceBody: "Chaque zone indique origine, limite et étape suivante. Sans preuve suffisante, l’application signale l’indisponibilité.", evidenceCards: [{ title: "Local par défaut", copy: "Scanner, bibliothèque et historique restent sur cet ordinateur jusqu’à une action explicite." }, { title: "Sources visibles", copy: "Les guides et fiches affichent leur provenance ; le catalogue n’est pas une copie Steam en temps réel." }, { title: "Action révisable", copy: "Les commandes sont proposées à la relecture ; Stray ne modifie jamais le système silencieusement." }],
    footerCreator: "Créé par Pedro, Brésil.", footerUninstall: "Désinstallation",
  },
  de: {
    station: "INTELLIGENZSTATION FÜR LINUX-GAMING", eyebrow: "IHRE UMGEBUNG. KLAR GELESEN.", heroMain: "Spielen unter Linux.", heroAccent: "Ohne Raten.", heroBody: "Eine lokale Ebene, um System, Spiele und Kompatibilität vor Entscheidungen zu verstehen. Keine erfundenen Zahlen. Keine versteckten Aktionen.", chooseFormat: "Format wählen",
    statusLocal: "LOKALER STATUS", scannerValue: "Bei Bedarf", libraryValue: "Lokale Analyse", evidenceValue: "Deklariert", viewPrinciples: "PRINZIPIEN ANZEIGEN",
    methodEyebrow: "DIE METHODE / 03 EBENEN", methodLead: "Stray Linux macht technische Signale lesbar und lässt den letzten Befehl bei Ihnen.", methodMain: "Werkzeuge, die", methodAccent: "vor dem Handeln erklären.", cards: [
      { ...cards("SYSTEM", "SPIELE", "KORREKTUR")[0], title: "Lesen Sie, was der PC sagt.", copy: "Scanner, Treiber, Grafiksession und Runtimes. Alles beginnt auf der Maschine, nicht mit einer Annahme." },
      { ...cards("SYSTEM", "SPIELE", "KORREKTUR")[1], title: "Vor dem Start verstehen.", copy: "Kontext für Steam, Heroic, Proton und lokale Bibliotheken mit deklarierten Grenzen und Quellen." },
      { ...cards("SYSTEM", "SPIELE", "KORREKTUR")[2], title: "Mit Kontext handeln.", copy: "LinuxFix ordnet Symptome, Risiken und Aktionen. Kein Befehl ohne Bestätigung." },
    ], marquee: "LOKAL. EXPLIZIT. ÜBERPRÜFBAR.",
    downloadsEyebrow: "ÜBERPRÜFBARE DOWNLOADS / V1.1.10", downloadsLead: "Wählen Sie die richtige Familie. Der Befehl lädt das Paket, prüft die Prüfsumme und installiert nur dieses Format.", downloadsMain: "Bereit für", downloadsAccent: "Ihre Maschine.", uninstallLead: "Bereits installiert? Sehen Sie die Deinstallation nach Plattform.",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "Offizielles", windowsAccent: ".EXE-Installationsprogramm", windowsBody: "Laden Sie das offizielle NSIS-Installationsprogramm. Prüfen Sie SHA-256 vor der Ausführung.", downloadExe: ".EXE herunterladen", windowsFootnote: "Kontrollierte Updates werden in der installierten Anwendung geprüft.",
    evidenceEyebrow: "WAS STRAY DEKLARIERT", evidenceMain: "Technische Daten", evidenceAccent: "mit Kontext.", evidenceBody: "Jeder Bereich nennt Herkunft, Grenze und nächsten Schritt. Ohne ausreichende Belege zeigt die App Nichtverfügbarkeit.", evidenceCards: [{ title: "Standardmäßig lokal", copy: "Scanner, Bibliothek und Verlauf bleiben bis zu einer expliziten Aktion auf diesem Computer." }, { title: "Sichtbare Quellen", copy: "Leitfäden und Einträge zeigen Herkunft; der Katalog ist keine Steam-Echtzeitkopie." }, { title: "Prüfbare Aktion", copy: "Befehle werden zur Prüfung angezeigt; Stray ändert das System nie stillschweigend." }],
    footerCreator: "Erstellt von Pedro, Brasilien.", footerUninstall: "Deinstallation",
  },
  it: {
    station: "STAZIONE DI INTELLIGENCE PER LINUX GAMING", eyebrow: "IL TUO AMBIENTE. LETTO CON CHIAREZZA.", heroMain: "Gioca su Linux.", heroAccent: "Senza supposizioni.", heroBody: "Un livello locale per capire sistema, giochi e compatibilità prima di decidere. Nessun numero inventato. Nessuna azione nascosta.", chooseFormat: "Scegli formato",
    statusLocal: "STATO LOCALE", scannerValue: "Su richiesta", libraryValue: "Lettura locale", evidenceValue: "Dichiarata", viewPrinciples: "VEDI PRINCIPI",
    methodEyebrow: "IL METODO / 03 LIVELLI", methodLead: "Stray Linux trasforma segnali tecnici in decisioni leggibili mantenendo il comando finale a te.", methodMain: "Strumenti che", methodAccent: "spiegano prima di agire.", cards: [
      { ...cards("SISTEMA", "GIOCHI", "CORREZIONE")[0], title: "Leggi cosa dice il PC.", copy: "Scanner, driver, sessione grafica e runtime. Tutto parte dalla macchina, non da un’ipotesi." },
      { ...cards("SISTEMA", "GIOCHI", "CORREZIONE")[1], title: "Comprendi prima di avviare.", copy: "Contesto per Steam, Heroic, Proton e librerie locali con limiti e fonti dichiarati." },
      { ...cards("SISTEMA", "GIOCHI", "CORREZIONE")[2], title: "Agisci con contesto.", copy: "LinuxFix organizza sintomi, rischi e azioni. Nessun comando senza conferma." },
    ], marquee: "LOCALE. ESPLICITO. VERIFICABILE.",
    downloadsEyebrow: "DOWNLOAD VERIFICABILI / V1.1.10", downloadsLead: "Scegli la famiglia corretta. Il comando scarica il pacchetto, verifica il checksum e installa solo quel formato.", downloadsMain: "Pronto per", downloadsAccent: "la tua macchina.", uninstallLead: "Hai già installato l’app? Vedi la disinstallazione per piattaforma.",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "Installatore ufficiale", windowsAccent: ".EXE", windowsBody: "Scarica l’installatore NSIS ufficiale. Conferma lo SHA-256 pubblicato prima dell’esecuzione.", downloadExe: "Scarica .EXE", windowsFootnote: "Gli aggiornamenti controllati sono verificati nell’app installata.",
    evidenceEyebrow: "COSA DICHIARA STRAY", evidenceMain: "Dati tecnici", evidenceAccent: "con contesto.", evidenceBody: "Ogni area indica origine, limite e passo successivo. Senza evidenza sufficiente, l’app mostra indisponibilità.", evidenceCards: [{ title: "Locale per impostazione", copy: "Scanner, libreria e cronologia restano su questo computer fino a un’azione esplicita." }, { title: "Fonti visibili", copy: "Guide e record mostrano provenienza; il catalogo non è una copia Steam in tempo reale." }, { title: "Azione verificabile", copy: "I comandi sono presentati per revisione; Stray non modifica il sistema in silenzio." }],
    footerCreator: "Creato da Pedro, Brasile.", footerUninstall: "Disinstallazione",
  },
  ru: {
    station: "СТАНЦИЯ АНАЛИТИКИ ДЛЯ LINUX GAMING", eyebrow: "ВАША СРЕДА. ПОНЯТНО ПРОЧИТАНА.", heroMain: "Играйте в Linux.", heroAccent: "Без догадок.", heroBody: "Локальный слой для понимания системы, игр и совместимости до решения. Без выдуманных чисел. Без скрытых действий.", chooseFormat: "Выбрать формат",
    statusLocal: "ЛОКАЛЬНЫЙ СТАТУС", scannerValue: "По запросу", libraryValue: "Локальное чтение", evidenceValue: "Указано", viewPrinciples: "ПОКАЗАТЬ ПРИНЦИПЫ",
    methodEyebrow: "МЕТОД / 03 СЛОЯ", methodLead: "Stray Linux превращает технические сигналы в понятные решения и оставляет последний выбор за вами.", methodMain: "Инструменты, которые", methodAccent: "объясняют до действия.", cards: [
      { ...cards("СИСТЕМА", "ИГРЫ", "ИСПРАВЛЕНИЕ")[0], title: "Читайте, что говорит ПК.", copy: "Сканер, драйверы, графическая сессия и runtimes. Всё начинается на машине, а не с предположения." },
      { ...cards("СИСТЕМА", "ИГРЫ", "ИСПРАВЛЕНИЕ")[1], title: "Поймите до запуска.", copy: "Контекст Steam, Heroic, Proton и локальных библиотек с заявленными ограничениями и источниками." },
      { ...cards("СИСТЕМА", "ИГРЫ", "ИСПРАВЛЕНИЕ")[2], title: "Действуйте с контекстом.", copy: "LinuxFix упорядочивает симптомы, риски и действия. Нет команд без подтверждения." },
    ], marquee: "ЛОКАЛЬНО. ЯВНО. ПРОВЕРЯЕМО.",
    downloadsEyebrow: "ПРОВЕРЯЕМЫЕ ЗАГРУЗКИ / V1.1.10", downloadsLead: "Выберите правильное семейство. Команда скачивает пакет, проверяет checksum и устанавливает только этот формат.", downloadsMain: "Готово для", downloadsAccent: "вашей машины.", uninstallLead: "Уже установили? Смотрите удаление по платформам.",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "Официальный", windowsAccent: ".EXE-установщик", windowsBody: "Скачайте официальный установщик NSIS. Проверьте опубликованный SHA-256 перед запуском.", downloadExe: "Скачать .EXE", windowsFootnote: "Контролируемые обновления проверяются в установленном приложении.",
    evidenceEyebrow: "ЧТО ЗАЯВЛЯЕТ STRAY", evidenceMain: "Технические данные", evidenceAccent: "с контекстом.", evidenceBody: "Каждая область указывает источник, ограничение и следующий шаг. При недостатке доказательств приложение показывает недоступность.", evidenceCards: [{ title: "Локально по умолчанию", copy: "Сканер, библиотека и история остаются на этом компьютере до явного действия." }, { title: "Видимые источники", copy: "Руководства и записи показывают происхождение; каталог не является копией Steam в реальном времени." }, { title: "Проверяемое действие", copy: "Команды представлены для проверки; Stray не меняет систему молча." }],
    footerCreator: "Создано Pedro, Бразилия.", footerUninstall: "Удаление",
  },
  "zh-CN": {
    station: "LINUX 游戏智能工作站", eyebrow: "你的环境。清晰读取。", heroMain: "在 Linux 上玩游戏。", heroAccent: "无需猜测。", heroBody: "在决策前理解系统、游戏和兼容性的本地层。没有虚构数据。没有隐藏操作。", chooseFormat: "选择格式",
    statusLocal: "本地状态", scannerValue: "按需", libraryValue: "本地读取", evidenceValue: "已声明", viewPrinciples: "查看原则",
    methodEyebrow: "方法 / 03 层", methodLead: "Stray Linux 将技术信号转化为易读的决策，同时由你保留最终控制。", methodMain: "工具会在", methodAccent: "行动前解释。", cards: [
      { ...cards("系统", "游戏", "修复")[0], title: "读取 PC 的信息。", copy: "扫描器、驱动、图形会话和运行时。一切从机器开始，而不是猜测。" },
      { ...cards("系统", "游戏", "修复")[1], title: "启动前先理解。", copy: "为 Steam、Heroic、Proton 和本地库提供上下文，并声明限制和来源。" },
      { ...cards("系统", "游戏", "修复")[2], title: "带着上下文行动。", copy: "LinuxFix 整理症状、风险和操作。没有确认不会应用命令。" },
    ], marquee: "本地。明确。可验证。", 
    downloadsEyebrow: "可验证下载 / V1.1.10", downloadsLead: "选择正确的发行版家族。命令会下载软件包、验证校验和并仅安装该格式。", downloadsMain: "为你的", downloadsAccent: "设备准备就绪。", uninstallLead: "已安装应用？查看各平台卸载说明。",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "官方", windowsAccent: ".EXE 安装程序", windowsBody: "下载官方 NSIS 安装程序。运行前确认已发布的 SHA-256。", downloadExe: "下载 .EXE", windowsFootnote: "受控更新会在已安装应用中检查。",
    evidenceEyebrow: "STRAY 声明的内容", evidenceMain: "技术数据", evidenceAccent: "附带上下文。", evidenceBody: "每个区域都说明来源、限制和下一步。证据不足时，应用会显示不可用。", evidenceCards: [{ title: "默认本地", copy: "扫描器、库和历史记录保留在此计算机上，直到明确操作。" }, { title: "可见来源", copy: "指南和记录显示来源；目录不是 Steam 的实时副本。" }, { title: "可审核操作", copy: "命令会先展示供审核；Stray 不会静默修改系统。" }],
    footerCreator: "由 Pedro 创建 · 巴西。", footerUninstall: "卸载",
  },
  ja: {
    station: "LINUX GAMING インテリジェンスステーション", eyebrow: "あなたの環境。明確に読み取る。", heroMain: "Linux で遊ぶ。", heroAccent: "推測なしで。", heroBody: "判断前にシステム、ゲーム、互換性を理解するローカルレイヤー。作り物の数値も隠れた操作もありません。", chooseFormat: "形式を選択",
    statusLocal: "ローカル状態", scannerValue: "オンデマンド", libraryValue: "ローカル読み取り", evidenceValue: "明示済み", viewPrinciples: "原則を見る",
    methodEyebrow: "方法 / 03 レイヤー", methodLead: "Stray Linux は技術的なシグナルを読みやすい判断に変え、最終操作はあなたに残します。", methodMain: "行動する前に", methodAccent: "説明するツール。", cards: [
      { ...cards("システム", "ゲーム", "修正")[0], title: "PC の声を読む。", copy: "スキャナー、ドライバー、グラフィックセッション、ランタイム。すべては推測でなくマシンから始まります。" },
      { ...cards("システム", "ゲーム", "修正")[1], title: "起動前に理解する。", copy: "Steam、Heroic、Proton、ローカルライブラリの文脈を、制限とソースと共に示します。" },
      { ...cards("システム", "ゲーム", "修正")[2], title: "文脈を持って行動する。", copy: "LinuxFix は症状、リスク、操作を整理します。確認なしにコマンドは適用されません。" },
    ], marquee: "ローカル。明示的。検証可能。",
    downloadsEyebrow: "検証可能なダウンロード / V1.1.10", downloadsLead: "正しいファミリーを選択してください。コマンドはパッケージを取得し、チェックサムを検証してその形式だけをインストールします。", downloadsMain: "あなたの", downloadsAccent: "マシンへ。", uninstallLead: "すでにインストール済みですか？プラットフォーム別の削除手順を確認してください。",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "公式", windowsAccent: ".EXE インストーラー", windowsBody: "公式 NSIS インストーラーをダウンロードし、実行前に公開された SHA-256 を確認してください。", downloadExe: ".EXE をダウンロード", windowsFootnote: "管理された更新はインストール済みアプリで確認されます。",
    evidenceEyebrow: "STRAY が明示すること", evidenceMain: "技術データ", evidenceAccent: "を文脈とともに。", evidenceBody: "各領域は出所、限界、次の手順を示します。証拠が不足するとアプリは利用不可を表示します。", evidenceCards: [{ title: "標準でローカル", copy: "スキャナー、ライブラリ、履歴は明示的な操作までこのコンピューターに残ります。" }, { title: "見えるソース", copy: "ガイドと記録は出所を表示し、カタログは Steam のリアルタイムコピーではありません。" }, { title: "確認可能な操作", copy: "コマンドは確認用に提示され、Stray が黙ってシステムを変更することはありません。" }],
    footerCreator: "Pedro 作 · ブラジル。", footerUninstall: "アンインストール",
  },
  ko: {
    station: "LINUX 게이밍 인텔리전스 스테이션", eyebrow: "내 환경. 명확하게 읽기.", heroMain: "Linux에서 플레이.", heroAccent: "추측 없이.", heroBody: "결정 전에 시스템, 게임, 호환성을 이해하는 로컬 레이어입니다. 꾸며낸 수치도 숨은 작업도 없습니다.", chooseFormat: "형식 선택",
    statusLocal: "로컬 상태", scannerValue: "요청 시", libraryValue: "로컬 읽기", evidenceValue: "명시됨", viewPrinciples: "원칙 보기",
    methodEyebrow: "방법 / 03 계층", methodLead: "Stray Linux는 기술 신호를 읽기 쉬운 결정으로 바꾸고 최종 제어는 사용자에게 남깁니다.", methodMain: "행동 전에", methodAccent: "설명하는 도구.", cards: [
      { ...cards("시스템", "게임", "수정")[0], title: "PC가 말하는 것을 읽으세요.", copy: "스캐너, 드라이버, 그래픽 세션과 런타임. 모든 것은 추측이 아닌 컴퓨터에서 시작합니다." },
      { ...cards("시스템", "게임", "수정")[1], title: "실행 전에 이해하세요.", copy: "Steam, Heroic, Proton과 로컬 라이브러리의 맥락을 제한과 출처와 함께 제공합니다." },
      { ...cards("시스템", "게임", "수정")[2], title: "맥락과 함께 행동하세요.", copy: "LinuxFix는 증상, 위험 및 작업을 정리합니다. 확인 없이 명령을 적용하지 않습니다." },
    ], marquee: "로컬. 명시적. 검증 가능.",
    downloadsEyebrow: "검증 가능한 다운로드 / V1.1.10", downloadsLead: "올바른 계열을 선택하세요. 명령은 패키지를 받고 체크섬을 확인한 뒤 해당 형식만 설치합니다.", downloadsMain: "내", downloadsAccent: "장비를 위해 준비됨.", uninstallLead: "이미 설치했나요? 플랫폼별 제거 방법을 확인하세요.",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "공식", windowsAccent: ".EXE 설치 프로그램", windowsBody: "공식 NSIS 설치 프로그램을 다운로드하고 실행 전 공개된 SHA-256을 확인하세요.", downloadExe: ".EXE 다운로드", windowsFootnote: "제어된 업데이트는 설치된 앱에서 확인됩니다.",
    evidenceEyebrow: "STRAY가 명시하는 것", evidenceMain: "기술 데이터", evidenceAccent: "와 맥락.", evidenceBody: "각 영역은 출처, 제한 및 다음 단계를 표시합니다. 근거가 부족하면 앱은 사용할 수 없음을 표시합니다.", evidenceCards: [{ title: "기본적으로 로컬", copy: "스캐너, 라이브러리 및 기록은 명시적 작업 전까지 이 컴퓨터에 남습니다." }, { title: "보이는 출처", copy: "가이드와 기록은 출처를 표시하며 카탈로그는 Steam 실시간 사본이 아닙니다." }, { title: "검토 가능한 작업", copy: "명령은 검토를 위해 표시되며 Stray는 시스템을 조용히 변경하지 않습니다." }],
    footerCreator: "Pedro 제작 · 브라질.", footerUninstall: "제거",
  },
  ar: {
    station: "محطة ذكاء لألعاب لينكس", eyebrow: "بيئتك. تُقرأ بوضوح.", heroMain: "العب على لينكس.", heroAccent: "دون تخمين.", heroBody: "طبقة محلية لفهم النظام والألعاب والتوافق قبل اتخاذ القرار. لا أرقام مختلقة ولا إجراءات مخفية.", chooseFormat: "اختر التنسيق",
    statusLocal: "الحالة المحلية", scannerValue: "عند الطلب", libraryValue: "قراءة محلية", evidenceValue: "مُعلنة", viewPrinciples: "عرض المبادئ",
    methodEyebrow: "المنهج / 03 طبقات", methodLead: "يحوّل Stray Linux الإشارات التقنية إلى قرارات قابلة للقراءة ويُبقي الأمر الأخير بين يديك.", methodMain: "أدوات", methodAccent: "تشرح قبل التنفيذ.", cards: [
      { ...cards("النظام", "الألعاب", "الإصلاح")[0], title: "اقرأ ما يقوله الحاسوب.", copy: "الماسح والتعريفات والجلسة الرسومية وبيئات التشغيل. كل شيء يبدأ من الجهاز لا من افتراض." },
      { ...cards("النظام", "الألعاب", "الإصلاح")[1], title: "افهم قبل التشغيل.", copy: "سياق Steam وHeroic وProton والمكتبات المحلية مع الحدود والمصادر المعلنة." },
      { ...cards("النظام", "الألعاب", "الإصلاح")[2], title: "تصرف ضمن السياق.", copy: "ينظم LinuxFix الأعراض والمخاطر والإجراءات. لا يُطبق أي أمر دون تأكيدك." },
    ], marquee: "محلي. صريح. قابل للتحقق.",
    downloadsEyebrow: "تنزيلات قابلة للتحقق / V1.1.10", downloadsLead: "اختر العائلة الصحيحة. ينزّل الأمر الحزمة ويتحقق من المجموع ويثبت هذا التنسيق فقط.", downloadsMain: "جاهز", downloadsAccent: "لجهازك.", uninstallLead: "هل ثبّت التطبيق بالفعل؟ راجع إزالة التثبيت حسب المنصة.",
    windowsEyebrow: "WINDOWS 10/11 / X64", windowsMain: "مثبّت رسمي", windowsAccent: ".EXE", windowsBody: "نزّل مثبّت NSIS الرسمي وتحقق من SHA-256 المنشور قبل تشغيله.", downloadExe: "نزّل .EXE", windowsFootnote: "يتم التحقق من التحديثات المتحكم بها داخل التطبيق المثبت.",
    evidenceEyebrow: "ما يصرّح به STRAY", evidenceMain: "بيانات تقنية", evidenceAccent: "ضمن سياق.", evidenceBody: "توضح كل منطقة الأصل والحد والخطوة التالية. عند عدم كفاية الدليل، يعرض التطبيق عدم التوفر.", evidenceCards: [{ title: "محلي افتراضياً", copy: "يبقى الماسح والمكتبة والسجل في هذا الحاسوب حتى إجراء صريح." }, { title: "مصادر مرئية", copy: "تعرض الأدلة والسجلات مصدرها؛ الكتالوج ليس نسخة Steam في الوقت الحقيقي." }, { title: "إجراء قابل للمراجعة", copy: "تُعرض الأوامر للمراجعة؛ لا يغير Stray النظام بصمت." }],
    footerCreator: "من إنشاء Pedro، البرازيل.", footerUninstall: "إزالة التثبيت",
  },
};

const currentPublicRelease = "1.1.11";

export const landingCopy: Record<Locale, LandingCopy> = Object.fromEntries(
  Object.entries(landingCopySource).map(([locale, copy]) => [locale, {
    ...copy,
    downloadsEyebrow: copy.downloadsEyebrow.replace(/1\.1\.\d+/, currentPublicRelease),
  }]),
) as Record<Locale, LandingCopy>;
