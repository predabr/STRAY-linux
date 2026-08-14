import type { Locale } from "@/contexts/LanguageContext";

type HomeDiagnosticsCopy = {
  eyebrow: string;
  title: string;
  status: string;
  scanning: string;
  gpu: string;
  driver: string;
  kernel: string;
  ready: string;
  openFix: string;
  previewNote: string;
  credit: string;
};

export const homeDiagnosticsCopy: Record<Locale, HomeDiagnosticsCopy> = {
  "pt-BR": { eyebrow: "LINUXFIX / AMBIENTE DETECTADO", title: "Diagnóstico em contexto", status: "Pronto para analisar", scanning: "checando o ambiente local", gpu: "GPU detectada", driver: "Driver gráfico", kernel: "Kernel do sistema", ready: "Sinais prontos para investigação", openFix: "Abrir LinuxFix", previewNote: "Prévia de interface; leituras reais acontecem somente no Scanner local.", credit: "Criado por Pedro · Brasil" },
  en: { eyebrow: "LINUXFIX / ENVIRONMENT DETECTED", title: "Diagnosis in context", status: "Ready to analyze", scanning: "checking the local environment", gpu: "GPU detected", driver: "Graphics driver", kernel: "System kernel", ready: "Signals ready for investigation", openFix: "Open LinuxFix", previewNote: "Interface preview; real readings happen only in the local Scanner.", credit: "Created by Pedro · Brazil" },
  es: { eyebrow: "LINUXFIX / ENTORNO DETECTADO", title: "Diagnóstico con contexto", status: "Listo para analizar", scanning: "comprobando el entorno local", gpu: "GPU detectada", driver: "Controlador gráfico", kernel: "Kernel del sistema", ready: "Señales listas para investigar", openFix: "Abrir LinuxFix", previewNote: "Vista previa de interfaz; las lecturas reales ocurren solo en el Escáner local.", credit: "Creado por Pedro · Brasil" },
  fr: { eyebrow: "LINUXFIX / ENVIRONNEMENT DÉTECTÉ", title: "Diagnostic en contexte", status: "Prêt à analyser", scanning: "vérification de l’environnement local", gpu: "GPU détecté", driver: "Pilote graphique", kernel: "Noyau système", ready: "Signaux prêts pour l’analyse", openFix: "Ouvrir LinuxFix", previewNote: "Aperçu de l’interface ; les lectures réelles se font uniquement dans l’Analyseur local.", credit: "Créé par Pedro · Brésil" },
  de: { eyebrow: "LINUXFIX / UMGEBUNG ERKANNT", title: "Diagnose im Kontext", status: "Bereit zur Analyse", scanning: "lokale Umgebung wird geprüft", gpu: "GPU erkannt", driver: "Grafiktreiber", kernel: "Systemkernel", ready: "Signale bereit für die Untersuchung", openFix: "LinuxFix öffnen", previewNote: "Oberflächenvorschau; echte Messwerte werden nur im lokalen Scanner ermittelt.", credit: "Erstellt von Pedro · Brasilien" },
  it: { eyebrow: "LINUXFIX / AMBIENTE RILEVATO", title: "Diagnosi nel contesto", status: "Pronto per l’analisi", scanning: "controllo dell’ambiente locale", gpu: "GPU rilevata", driver: "Driver grafico", kernel: "Kernel di sistema", ready: "Segnali pronti per l’indagine", openFix: "Apri LinuxFix", previewNote: "Anteprima dell’interfaccia; le letture reali avvengono solo nello Scanner locale.", credit: "Creato da Pedro · Brasile" },
  ru: { eyebrow: "LINUXFIX / СРЕДА ОБНАРУЖЕНА", title: "Диагностика в контексте", status: "Готово к анализу", scanning: "проверка локальной среды", gpu: "GPU обнаружен", driver: "Графический драйвер", kernel: "Ядро системы", ready: "Сигналы готовы к исследованию", openFix: "Открыть LinuxFix", previewNote: "Предварительный просмотр интерфейса; реальные данные считываются только локальным Сканером.", credit: "Создано Педро · Бразилия" },
  "zh-CN": { eyebrow: "LINUXFIX / 已检测环境", title: "结合环境的诊断", status: "已准备分析", scanning: "正在检查本地环境", gpu: "已检测 GPU", driver: "图形驱动", kernel: "系统内核", ready: "信号已准备好调查", openFix: "打开 LinuxFix", previewNote: "界面预览；实际读取仅在本地扫描器中进行。", credit: "由 Pedro 创建 · 巴西" },
  ja: { eyebrow: "LINUXFIX / 環境を検出", title: "環境に基づく診断", status: "分析の準備完了", scanning: "ローカル環境を確認中", gpu: "検出された GPU", driver: "グラフィックドライバー", kernel: "システムカーネル", ready: "調査の準備ができたシグナル", openFix: "LinuxFix を開く", previewNote: "インターフェースのプレビューです。実際の読み取りはローカルスキャナーでのみ行われます。", credit: "Pedro 制作 · ブラジル" },
  ko: { eyebrow: "LINUXFIX / 환경 감지됨", title: "환경 기반 진단", status: "분석 준비 완료", scanning: "로컬 환경 확인 중", gpu: "감지된 GPU", driver: "그래픽 드라이버", kernel: "시스템 커널", ready: "조사 준비가 된 신호", openFix: "LinuxFix 열기", previewNote: "인터페이스 미리보기이며 실제 읽기는 로컬 스캐너에서만 수행됩니다.", credit: "Pedro 제작 · 브라질" },
  ar: { eyebrow: "LINUXFIX / تم اكتشاف البيئة", title: "تشخيص ضمن السياق", status: "جاهز للتحليل", scanning: "جارٍ فحص البيئة المحلية", gpu: "تم اكتشاف GPU", driver: "برنامج تشغيل الرسوميات", kernel: "نواة النظام", ready: "إشارات جاهزة للتحقيق", openFix: "فتح LinuxFix", previewNote: "هذه معاينة للواجهة؛ تحدث القراءات الفعلية في الماسح المحلي فقط.", credit: "من إنشاء Pedro · البرازيل" },
};
