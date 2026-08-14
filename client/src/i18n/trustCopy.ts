import type { Locale } from "@/contexts/LanguageContext";

type TrustCopy = { verified: string; official: string; community: string; estimated: string; unverified: string; source: string; status: string; date: string; confidence: string; method: string; evidence: string; noSource: string; details: string };

export const trustCopy: Record<Locale, TrustCopy> = {
  "pt-BR": { verified: "Verificado", official: "Oficial", community: "Comunidade", estimated: "Estimado", unverified: "Sem dados", source: "Fonte", status: "Status", date: "Data", confidence: "Confiança", method: "Método", evidence: "Evidências", noSource: "Fonte não informada", details: "Detalhes da confiança" },
  en: { verified: "Verified", official: "Official", community: "Community", estimated: "Estimated", unverified: "No data", source: "Source", status: "Status", date: "Date", confidence: "Confidence", method: "Method", evidence: "Evidence", noSource: "Source not provided", details: "Trust details" },
  es: { verified: "Verificado", official: "Oficial", community: "Comunidad", estimated: "Estimado", unverified: "Sin datos", source: "Fuente", status: "Estado", date: "Fecha", confidence: "Confianza", method: "Método", evidence: "Evidencias", noSource: "Fuente no informada", details: "Detalles de confianza" },
  fr: { verified: "Vérifié", official: "Officiel", community: "Communauté", estimated: "Estimé", unverified: "Aucune donnée", source: "Source", status: "Statut", date: "Date", confidence: "Confiance", method: "Méthode", evidence: "Éléments de preuve", noSource: "Source non indiquée", details: "Détails de confiance" },
  de: { verified: "Verifiziert", official: "Offiziell", community: "Community", estimated: "Geschätzt", unverified: "Keine Daten", source: "Quelle", status: "Status", date: "Datum", confidence: "Vertrauen", method: "Methode", evidence: "Belege", noSource: "Quelle nicht angegeben", details: "Vertrauensdetails" },
  it: { verified: "Verificato", official: "Ufficiale", community: "Comunità", estimated: "Stimato", unverified: "Nessun dato", source: "Fonte", status: "Stato", date: "Data", confidence: "Affidabilità", method: "Metodo", evidence: "Evidenze", noSource: "Fonte non indicata", details: "Dettagli di affidabilità" },
  ru: { verified: "Проверено", official: "Официально", community: "Сообщество", estimated: "Расчётно", unverified: "Нет данных", source: "Источник", status: "Статус", date: "Дата", confidence: "Достоверность", method: "Метод", evidence: "Доказательства", noSource: "Источник не указан", details: "Сведения о доверии" },
  "zh-CN": { verified: "已验证", official: "官方", community: "社区", estimated: "估算", unverified: "无数据", source: "来源", status: "状态", date: "日期", confidence: "可信度", method: "方法", evidence: "证据", noSource: "未提供来源", details: "可信度详情" },
  ja: { verified: "検証済み", official: "公式", community: "コミュニティ", estimated: "推定", unverified: "データなし", source: "情報源", status: "状態", date: "日付", confidence: "信頼度", method: "方法", evidence: "根拠", noSource: "情報源がありません", details: "信頼性の詳細" },
  ko: { verified: "검증됨", official: "공식", community: "커뮤니티", estimated: "추정", unverified: "데이터 없음", source: "출처", status: "상태", date: "날짜", confidence: "신뢰도", method: "방법", evidence: "근거", noSource: "출처가 제공되지 않음", details: "신뢰도 세부 정보" },
  ar: { verified: "تم التحقق", official: "رسمي", community: "المجتمع", estimated: "تقديري", unverified: "لا توجد بيانات", source: "المصدر", status: "الحالة", date: "التاريخ", confidence: "الثقة", method: "المنهج", evidence: "الأدلة", noSource: "لم يُذكر المصدر", details: "تفاصيل الموثوقية" },
};

export function getTrustCopy(locale: Locale) { return trustCopy[locale] ?? trustCopy["pt-BR"]; }
