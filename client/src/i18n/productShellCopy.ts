import type { Locale } from "@/contexts/LanguageContext";

type ProductShellCopy = { workspace: string; system: string; personal: string; status: string; version: string; };

export const productShellCopy: Record<Locale, ProductShellCopy> = {
  "pt-BR": { workspace: "WORKSPACE", system: "SISTEMA", personal: "PESSOAL", status: "Sistema online", version: "Versão 1.0" },
  en: { workspace: "WORKSPACE", system: "SYSTEM", personal: "PERSONAL", status: "System online", version: "Version 1.0" },
  es: { workspace: "ESPACIO DE TRABAJO", system: "SISTEMA", personal: "PERSONAL", status: "Sistema en línea", version: "Versión 1.0" },
  fr: { workspace: "ESPACE DE TRAVAIL", system: "SYSTÈME", personal: "PERSONNEL", status: "Système en ligne", version: "Version 1.0" },
  de: { workspace: "ARBEITSBEREICH", system: "SYSTEM", personal: "PERSÖNLICH", status: "System online", version: "Version 1.0" },
  it: { workspace: "AREA DI LAVORO", system: "SISTEMA", personal: "PERSONALE", status: "Sistema online", version: "Versione 1.0" },
  ru: { workspace: "РАБОЧЕЕ ПРОСТРАНСТВО", system: "СИСТЕМА", personal: "ЛИЧНОЕ", status: "Система онлайн", version: "Версия 1.0" },
  "zh-CN": { workspace: "工作区", system: "系统", personal: "个人", status: "系统在线", version: "版本 1.0" },
  ja: { workspace: "ワークスペース", system: "システム", personal: "個人", status: "システムオンライン", version: "バージョン 1.0" },
  ko: { workspace: "작업 공간", system: "시스템", personal: "개인", status: "시스템 온라인", version: "버전 1.0" },
  ar: { workspace: "مساحة العمل", system: "النظام", personal: "شخصي", status: "النظام متصل", version: "الإصدار 1.0" },
};
