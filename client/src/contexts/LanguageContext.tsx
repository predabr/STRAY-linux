import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import generatedStaticTranslations from "../i18n/generatedStaticTranslations.json";

export const SUPPORTED_LOCALES = ["pt-BR", "en", "es", "fr", "de", "it", "ru", "zh-CN", "ja", "ko", "ar"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const localeMeta: Record<Locale, { nativeName: string; direction: "ltr" | "rtl" }> = {
  "pt-BR": { nativeName: "Português (Brasil)", direction: "ltr" }, en: { nativeName: "English", direction: "ltr" }, es: { nativeName: "Español", direction: "ltr" }, fr: { nativeName: "Français", direction: "ltr" }, de: { nativeName: "Deutsch", direction: "ltr" }, it: { nativeName: "Italiano", direction: "ltr" }, ru: { nativeName: "Русский", direction: "ltr" }, "zh-CN": { nativeName: "简体中文", direction: "ltr" }, ja: { nativeName: "日本語", direction: "ltr" }, ko: { nativeName: "한국어", direction: "ltr" }, ar: { nativeName: "العربية", direction: "rtl" },
};

export const translationCatalog = {
  "pt-BR": { gameHub: "GameHub", benchmark: "Benchmark", windows: "Windows", wiki: "Wiki", distros: "Distros", linuxFix: "LinuxFix", setup: "Setup", assistant: "Assistente", search: "Pesquisar", openSearch: "Abrir paleta de pesquisa", theme: "Tema", dark: "Escuro", light: "Claro", system: "Sistema", dashboard: "Painel", signIn: "Entrar", language: "Idioma", preferences: "Preferências", interfaceTheme: "Tema de interface", savedOnDevice: "As escolhas são salvas neste dispositivo e aplicadas a toda a plataforma.", personalData: "O histórico de chat, benchmarks e perfil ficam vinculados à sua conta. Para apagar conteúdo pessoal, utilize as ações individuais de cada seção.", requiredLogin: "Acesso necessário", loginToContinue: "Entre para acessar seu painel, perfil e recursos pessoais.", myPc: "Meu PC", favorites: "Favoritos", savedGuides: "Guias salvos", reports: "Relatórios", overview: "Visão geral", settings: "Configurações", loading: "Carregando…", unavailable: "Dados indisponíveis", retry: "Tentar novamente", detectedSystem: "Sistema detectado", scanner: "Scanner", systemHealth: "Saúde do sistema", installedGames: "Jogos instalados", offline: "Modo offline", syncing: "Sincronizando…", synced: "Sincronizado" },
  en: { gameHub: "GameHub", benchmark: "Benchmark", windows: "Windows", wiki: "Wiki", distros: "Distros", linuxFix: "LinuxFix", setup: "Setup", assistant: "Assistant", search: "Search", openSearch: "Open search palette", theme: "Theme", dark: "Dark", light: "Light", system: "System", dashboard: "Dashboard", signIn: "Sign in", language: "Language", preferences: "Preferences", interfaceTheme: "Interface theme", savedOnDevice: "Choices are saved on this device and applied across the platform.", personalData: "Chat history, benchmarks and profile are linked to your account. Use the individual actions in each section to remove personal content.", requiredLogin: "Access required", loginToContinue: "Sign in to access your dashboard, profile and personal features.", myPc: "My PC", favorites: "Favorites", savedGuides: "Saved guides", reports: "Reports", overview: "Overview", settings: "Settings", loading: "Loading…", unavailable: "Data unavailable", retry: "Try again", detectedSystem: "Detected system", scanner: "Scanner", systemHealth: "System health", installedGames: "Installed games", offline: "Offline mode", syncing: "Syncing…", synced: "Synced" },
  es: { gameHub: "GameHub", benchmark: "Benchmark", windows: "Windows", wiki: "Wiki", distros: "Distros", linuxFix: "LinuxFix", setup: "Configuración", assistant: "Asistente", search: "Buscar", openSearch: "Abrir paleta de búsqueda", theme: "Tema", dark: "Oscuro", light: "Claro", system: "Sistema", dashboard: "Panel", signIn: "Iniciar sesión", language: "Idioma", preferences: "Preferencias", interfaceTheme: "Tema de la interfaz", savedOnDevice: "Las opciones se guardan en este dispositivo y se aplican en toda la plataforma.", personalData: "El historial de chat, los benchmarks y el perfil están vinculados a tu cuenta. Usa las acciones individuales de cada sección para eliminar contenido personal.", requiredLogin: "Acceso necesario", loginToContinue: "Inicia sesión para acceder a tu panel, perfil y funciones personales.", myPc: "Mi PC", favorites: "Favoritos", savedGuides: "Guías guardadas", reports: "Informes", overview: "Resumen", settings: "Configuración", loading: "Cargando…", unavailable: "Datos no disponibles", retry: "Intentar de nuevo", detectedSystem: "Sistema detectado", scanner: "Escáner", systemHealth: "Estado del sistema", installedGames: "Juegos instalados", offline: "Modo sin conexión", syncing: "Sincronizando…", synced: "Sincronizado" },
  fr: { gameHub: "GameHub", benchmark: "Benchmark", windows: "Windows", wiki: "Wiki", distros: "Distributions", linuxFix: "LinuxFix", setup: "Configuration", assistant: "Assistant", search: "Rechercher", openSearch: "Ouvrir la palette de recherche", theme: "Thème", dark: "Sombre", light: "Clair", system: "Système", dashboard: "Tableau de bord", signIn: "Se connecter", language: "Langue", preferences: "Préférences", interfaceTheme: "Thème de l’interface", savedOnDevice: "Les choix sont enregistrés sur cet appareil et appliqués à toute la plateforme.", personalData: "L’historique du chat, les benchmarks et le profil sont liés à votre compte. Utilisez les actions de chaque section pour supprimer du contenu personnel.", requiredLogin: "Accès requis", loginToContinue: "Connectez-vous pour accéder à votre tableau de bord, profil et fonctions personnelles.", myPc: "Mon PC", favorites: "Favoris", savedGuides: "Guides enregistrés", reports: "Rapports", overview: "Vue d’ensemble", settings: "Paramètres", loading: "Chargement…", unavailable: "Données indisponibles", retry: "Réessayer", detectedSystem: "Système détecté", scanner: "Analyseur", systemHealth: "État du système", installedGames: "Jeux installés", offline: "Mode hors ligne", syncing: "Synchronisation…", synced: "Synchronisé" },
  de: { gameHub: "GameHub", benchmark: "Benchmark", windows: "Windows", wiki: "Wiki", distros: "Distributionen", linuxFix: "LinuxFix", setup: "Einrichtung", assistant: "Assistent", search: "Suchen", openSearch: "Suchpalette öffnen", theme: "Design", dark: "Dunkel", light: "Hell", system: "System", dashboard: "Übersicht", signIn: "Anmelden", language: "Sprache", preferences: "Einstellungen", interfaceTheme: "Oberflächendesign", savedOnDevice: "Auswahlen werden auf diesem Gerät gespeichert und auf der gesamten Plattform angewendet.", personalData: "Chatverlauf, Benchmarks und Profil sind mit Ihrem Konto verknüpft. Verwenden Sie die jeweiligen Aktionen, um persönliche Inhalte zu löschen.", requiredLogin: "Zugriff erforderlich", loginToContinue: "Melden Sie sich an, um Übersicht, Profil und persönliche Funktionen zu nutzen.", myPc: "Mein PC", favorites: "Favoriten", savedGuides: "Gespeicherte Anleitungen", reports: "Berichte", overview: "Übersicht", settings: "Einstellungen", loading: "Laden…", unavailable: "Daten nicht verfügbar", retry: "Erneut versuchen", detectedSystem: "Erkanntes System", scanner: "Scanner", systemHealth: "Systemzustand", installedGames: "Installierte Spiele", offline: "Offline-Modus", syncing: "Synchronisierung…", synced: "Synchronisiert" },
  it: { gameHub: "GameHub", benchmark: "Benchmark", windows: "Windows", wiki: "Wiki", distros: "Distribuzioni", linuxFix: "LinuxFix", setup: "Configurazione", assistant: "Assistente", search: "Cerca", openSearch: "Apri palette di ricerca", theme: "Tema", dark: "Scuro", light: "Chiaro", system: "Sistema", dashboard: "Pannello", signIn: "Accedi", language: "Lingua", preferences: "Preferenze", interfaceTheme: "Tema dell’interfaccia", savedOnDevice: "Le scelte sono salvate su questo dispositivo e applicate a tutta la piattaforma.", personalData: "Cronologia chat, benchmark e profilo sono collegati al tuo account. Usa le azioni nelle singole sezioni per rimuovere contenuti personali.", requiredLogin: "Accesso richiesto", loginToContinue: "Accedi per usare pannello, profilo e funzioni personali.", myPc: "Il mio PC", favorites: "Preferiti", savedGuides: "Guide salvate", reports: "Segnalazioni", overview: "Panoramica", settings: "Impostazioni", loading: "Caricamento…", unavailable: "Dati non disponibili", retry: "Riprova", detectedSystem: "Sistema rilevato", scanner: "Scanner", systemHealth: "Stato del sistema", installedGames: "Giochi installati", offline: "Modalità offline", syncing: "Sincronizzazione…", synced: "Sincronizzato" },
  ru: { gameHub: "Игровой центр", benchmark: "Бенчмарк", windows: "Windows", wiki: "Вики", distros: "Дистрибутивы", linuxFix: "LinuxFix", setup: "Настройка", assistant: "Помощник", search: "Поиск", openSearch: "Открыть поиск", theme: "Тема", dark: "Тёмная", light: "Светлая", system: "Системная", dashboard: "Панель", signIn: "Войти", language: "Язык", preferences: "Настройки", interfaceTheme: "Тема интерфейса", savedOnDevice: "Выбор сохраняется на этом устройстве и применяется ко всей платформе.", personalData: "История чата, бенчмарки и профиль привязаны к вашей учётной записи. Используйте действия в разделах для удаления личных данных.", requiredLogin: "Требуется доступ", loginToContinue: "Войдите, чтобы открыть панель, профиль и личные функции.", myPc: "Мой ПК", favorites: "Избранное", savedGuides: "Сохранённые руководства", reports: "Отчёты", overview: "Обзор", settings: "Настройки", loading: "Загрузка…", unavailable: "Данные недоступны", retry: "Повторить", detectedSystem: "Обнаруженная система", scanner: "Сканер", systemHealth: "Состояние системы", installedGames: "Установленные игры", offline: "Автономный режим", syncing: "Синхронизация…", synced: "Синхронизировано" },
  "zh-CN": { gameHub: "游戏中心", benchmark: "基准测试", windows: "Windows", wiki: "Wiki", distros: "发行版", linuxFix: "LinuxFix", setup: "配置", assistant: "助手", search: "搜索", openSearch: "打开搜索面板", theme: "主题", dark: "深色", light: "浅色", system: "系统", dashboard: "控制面板", signIn: "登录", language: "语言", preferences: "偏好设置", interfaceTheme: "界面主题", savedOnDevice: "选择会保存在此设备上，并应用于整个平台。", personalData: "聊天记录、基准测试和配置文件与您的帐户关联。请使用各部分中的操作删除个人内容。", requiredLogin: "需要访问权限", loginToContinue: "请登录以访问控制面板、配置文件和个人功能。", myPc: "我的电脑", favorites: "收藏夹", savedGuides: "已保存指南", reports: "报告", overview: "概览", settings: "设置", loading: "正在加载…", unavailable: "数据不可用", retry: "重试", detectedSystem: "检测到的系统", scanner: "扫描器", systemHealth: "系统健康", installedGames: "已安装游戏", offline: "离线模式", syncing: "正在同步…", synced: "已同步" },
  ja: { gameHub: "ゲームハブ", benchmark: "ベンチマーク", windows: "Windows", wiki: "Wiki", distros: "ディストリビューション", linuxFix: "LinuxFix", setup: "セットアップ", assistant: "アシスタント", search: "検索", openSearch: "検索パレットを開く", theme: "テーマ", dark: "ダーク", light: "ライト", system: "システム", dashboard: "ダッシュボード", signIn: "ログイン", language: "言語", preferences: "設定", interfaceTheme: "インターフェーステーマ", savedOnDevice: "選択内容はこのデバイスに保存され、プラットフォーム全体に適用されます。", personalData: "チャット履歴、ベンチマーク、プロフィールはアカウントに紐づきます。個人コンテンツを削除するには各セクションの操作を使用してください。", requiredLogin: "アクセスが必要です", loginToContinue: "ダッシュボード、プロフィール、個人機能を利用するにはログインしてください。", myPc: "マイPC", favorites: "お気に入り", savedGuides: "保存済みガイド", reports: "レポート", overview: "概要", settings: "設定", loading: "読み込み中…", unavailable: "データを利用できません", retry: "再試行", detectedSystem: "検出されたシステム", scanner: "スキャナー", systemHealth: "システム状態", installedGames: "インストール済みゲーム", offline: "オフラインモード", syncing: "同期中…", synced: "同期済み" },
  ko: { gameHub: "게임 허브", benchmark: "벤치마크", windows: "Windows", wiki: "Wiki", distros: "배포판", linuxFix: "LinuxFix", setup: "설정", assistant: "도우미", search: "검색", openSearch: "검색 팔레트 열기", theme: "테마", dark: "어둡게", light: "밝게", system: "시스템", dashboard: "대시보드", signIn: "로그인", language: "언어", preferences: "환경설정", interfaceTheme: "인터페이스 테마", savedOnDevice: "선택 사항은 이 기기에 저장되고 플랫폼 전체에 적용됩니다.", personalData: "채팅 기록, 벤치마크 및 프로필은 계정에 연결됩니다. 개인 콘텐츠를 삭제하려면 각 섹션의 동작을 사용하세요.", requiredLogin: "접근 권한 필요", loginToContinue: "대시보드, 프로필 및 개인 기능을 사용하려면 로그인하세요.", myPc: "내 PC", favorites: "즐겨찾기", savedGuides: "저장된 가이드", reports: "보고서", overview: "개요", settings: "설정", loading: "불러오는 중…", unavailable: "데이터를 사용할 수 없음", retry: "다시 시도", detectedSystem: "감지된 시스템", scanner: "스캐너", systemHealth: "시스템 상태", installedGames: "설치된 게임", offline: "오프라인 모드", syncing: "동기화 중…", synced: "동기화됨" },
  ar: { gameHub: "مركز الألعاب", benchmark: "اختبار الأداء", windows: "Windows", wiki: "ويكي", distros: "التوزيعات", linuxFix: "LinuxFix", setup: "الإعداد", assistant: "المساعد", search: "بحث", openSearch: "فتح لوحة البحث", theme: "السمة", dark: "داكن", light: "فاتح", system: "النظام", dashboard: "لوحة التحكم", signIn: "تسجيل الدخول", language: "اللغة", preferences: "التفضيلات", interfaceTheme: "سمة الواجهة", savedOnDevice: "تُحفظ الاختيارات على هذا الجهاز وتُطبّق على كامل المنصة.", personalData: "يرتبط سجل المحادثات ونتائج الأداء والملف الشخصي بحسابك. استخدم إجراءات الأقسام الفردية لحذف المحتوى الشخصي.", requiredLogin: "الوصول مطلوب", loginToContinue: "سجّل الدخول للوصول إلى لوحة التحكم والملف الشخصي والميزات الشخصية.", myPc: "جهازي", favorites: "المفضلة", savedGuides: "الأدلة المحفوظة", reports: "التقارير", overview: "نظرة عامة", settings: "الإعدادات", loading: "جارٍ التحميل…", unavailable: "البيانات غير متاحة", retry: "إعادة المحاولة", detectedSystem: "النظام المكتشف", scanner: "الماسح", systemHealth: "حالة النظام", installedGames: "الألعاب المثبتة", offline: "وضع عدم الاتصال", syncing: "جارٍ المزامنة…", synced: "تمت المزامنة" },
} as const;

export const staticTranslationCatalog = generatedStaticTranslations as Record<Locale, Record<string, string>>;

type MessageKey = keyof (typeof translationCatalog)["pt-BR"];
type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: MessageKey) => string; formatDate: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "stray-language";

function resolveLocale(value: string | null): Locale {
  if (value && (SUPPORTED_LOCALES as readonly string[]).includes(value)) return value as Locale;
  const browser = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "";
  if (browser.startsWith("pt")) return "pt-BR";
  if (browser.startsWith("zh")) return "zh-CN";
  return (SUPPORTED_LOCALES as readonly string[]).includes(browser) ? browser as Locale : "pt-BR";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => resolveLocale(typeof window === "undefined" ? null : localStorage.getItem(STORAGE_KEY)));
  const setLocale = (next: Locale) => setLocaleState(next);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, locale); document.documentElement.lang = locale; document.documentElement.dir = localeMeta[locale].direction; }, [locale]);
  const value = useMemo<LanguageContextValue>(() => ({ locale, setLocale, t: (key) => translationCatalog[locale][key] ?? translationCatalog["pt-BR"][key], formatDate: (date, options) => new Intl.DateTimeFormat(locale, options ?? { dateStyle: "medium", timeStyle: "short" }).format(new Date(date)) }), [locale]);
  return <LanguageContext.Provider value={value}>{children}<StaticTextLocalizer /></LanguageContext.Provider>;
}

export function useLanguage() { const context = useContext(LanguageContext); if (!context) throw new Error("useLanguage precisa estar dentro de LanguageProvider."); return context; }

const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Record<string, string>>();
const localizableAttributes = ["aria-label", "placeholder", "title"];

function splitWhitespace(value: string) {
  return { prefix: value.match(/^\s*/)?.[0] ?? "", core: value.trim(), suffix: value.match(/\s*$/)?.[0] ?? "" };
}

function StaticTextLocalizer() {
  const { locale } = useLanguage();

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const catalog = staticTranslationCatalog[locale] ?? staticTranslationCatalog["pt-BR"];
    const translateText = (node: Text) => {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "CODE", "KBD", "PRE", "TEXTAREA", "OPTION"].includes(parent.tagName) || parent.isContentEditable) return;
      const baseline = originalText.get(node) ?? node.data;
      originalText.set(node, baseline);
      const { prefix, core, suffix } = splitWhitespace(baseline);
      const translated = catalog[core] ?? core;
      const next = `${prefix}${translated}${suffix}`;
      if (node.data !== next) node.data = next;
    };
    const translateAttributes = (element: Element) => {
      const baselines = originalAttributes.get(element) ?? {};
      for (const attribute of localizableAttributes) {
        const current = element.getAttribute(attribute);
        if (current === null) continue;
        const baseline = baselines[attribute] ?? current;
        baselines[attribute] = baseline;
        const translated = catalog[baseline] ?? baseline;
        if (current !== translated) element.setAttribute(attribute, translated);
      }
      originalAttributes.set(element, baselines);
    };
    const translateTree = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) translateText(node as Text);
      if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
      const element = node as Element;
      if (node.nodeType === Node.ELEMENT_NODE) translateAttributes(element);
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      let current: Node | null;
      while ((current = walker.nextNode())) translateText(current as Text);
      if (node.nodeType === Node.ELEMENT_NODE) element.querySelectorAll("[aria-label], [placeholder], [title]").forEach(translateAttributes);
    };
    translateTree(root);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") translateText(record.target as Text);
        for (const node of Array.from(record.addedNodes)) translateTree(node);
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [locale]);
  return null;
}
