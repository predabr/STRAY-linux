import type { Locale } from "@/contexts/LanguageContext";

type ProductShellCopy = { workspace: string; system: string; personal: string; tools: string; compare: string; status: string; version: string; };

export const productShellCopy: Record<Locale, ProductShellCopy> = {
  "pt-BR": { workspace: "WORKSPACE", system: "SISTEMA", personal: "PESSOAL", tools: "MAIS FERRAMENTAS", compare: "Comparar", status: "Sistema online", version: "Versão 1.1.0" },
  en: { workspace: "WORKSPACE", system: "SYSTEM", personal: "PERSONAL", tools: "MORE TOOLS", compare: "Compare", status: "System online", version: "Version 1.1.0" },
  es: { workspace: "ESPACIO DE TRABAJO", system: "SISTEMA", personal: "PERSONAL", tools: "MÁS HERRAMIENTAS", compare: "Comparar", status: "Sistema en línea", version: "Versión 1.1.0" },
  fr: { workspace: "ESPACE DE TRAVAIL", system: "SYSTÈME", personal: "PERSONNEL", tools: "PLUS D'OUTILS", compare: "Comparer", status: "Système en ligne", version: "Version 1.1.0" },
  de: { workspace: "ARBEITSBEREICH", system: "SYSTEM", personal: "PERSÖNLICH", tools: "WEITERE WERKZEUGE", compare: "Vergleichen", status: "System online", version: "Version 1.1.0" },
  it: { workspace: "AREA DI LAVORO", system: "SISTEMA", personal: "PERSONALE", tools: "ALTRI STRUMENTI", compare: "Confronta", status: "Sistema online", version: "Versione 1.1.0" },
  ru: { workspace: "РАБОЧЕЕ ПРОСТРАНСТВО", system: "СИСТЕМА", personal: "ЛИЧНОЕ", tools: "БОЛЬШЕ ИНСТРУМЕНТОВ", compare: "Сравнить", status: "Система онлайн", version: "Версия 1.1.0" },
  "zh-CN": { workspace: "工作区", system: "系统", personal: "个人", tools: "更多工具", compare: "比较", status: "系统在线", version: "版本 1.1.0" },
  ja: { workspace: "ワークスペース", system: "システム", personal: "個人", tools: "その他のツール", compare: "比較", status: "システムオンライン", version: "バージョン 1.1.0" },
  ko: { workspace: "작업 공간", system: "시스템", personal: "개인", tools: "추가 도구", compare: "비교", status: "시스템 온라인", version: "버전 1.1.0" },
  ar: { workspace: "مساحة العمل", system: "النظام", personal: "شخصي", tools: "المزيد من الأدوات", compare: "مقارنة", status: "النظام متصل", version: "الإصدار 1.1.0" },
};
