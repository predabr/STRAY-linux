import type { Locale } from "@/contexts/LanguageContext";
import settingsCopySource from "./settingsCopy.json";

export type SettingsCopy = {
  breadcrumbPersonal: string; breadcrumbSettings: string; eyebrow: string; title: string; description: string;
  appearanceTitle: string; appearanceDescription: string; blackTheme: string; blackThemeDetail: string; language: string; languageHint: string;
  reduceMotion: string; reduceMotionDetail: string; compactDensity: string; compactDensityDetail: string;
  scannerTitle: string; scannerDescription: string; automaticScanner: string; automaticScannerDetail: string; gameDiscovery: string; gameDiscoveryDetail: string; steamConfirmation: string; steamConfirmationDetail: string; maintenancePreview: string; maintenancePreviewDetail: string;
  aiTitle: string; aiDescription: string; localAiContext: string; localAiContextDetail: string; performanceMonitoring: string; performanceMonitoringDetail: string; noHiddenCollection: string; noHiddenCollectionDetail: string;
  privacyTitle: string; privacyDescription: string; localData: string; active: string; localDataDetail: string; telemetry: string; disabled: string; telemetryDetail: string; sharedPerformance: string; sharedPerformanceDetail: string; aiData: string; localContext: string; aiDataDetail: string; reviewSync: string;
  updatesTitle: string; updatesDescription: string; updaterUnavailable: string; updateDevelopment: string; updateUnavailable: string; updateIdle: string; updateChecking: string; updateDownloading: string; updateReady: string; updateInstalling: string; updateUpToDate: string; updateError: string; integrityHint: string; updateExplanation: string; checkNow: string; openDownloads: string; resetPreferences: string; savedNotice: string; resetConfirm: string; resetNotice: string; updateQueryError: string; feedCheck: string; completeSuffix: string;
};

export const settingsCopy = settingsCopySource as Record<Locale, SettingsCopy>;
