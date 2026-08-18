import { PageBreadcrumbs } from "@/components/platform/PageBreadcrumbs";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { localeMeta, SUPPORTED_LOCALES, useLanguage } from "@/contexts/LanguageContext";
import { settingsCopy, type SettingsCopy } from "@/i18n/settingsCopy";
import { Bell, Bot, CloudOff, Download, Eye, Globe2, Monitor, RefreshCw, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

type LocalSettings = { performanceMonitoring: boolean; gameDetection: boolean; launchConfirmation: boolean; automaticScanner: boolean; maintenancePreview: boolean; localAiContext: boolean; reducedMotion: boolean; compactDensity: boolean };
type UpdateState = { state: string; version?: string; progress?: number; detail?: string };

const key = "stray-desktop-settings-v1";
const defaults: LocalSettings = { performanceMonitoring: false, gameDetection: true, launchConfirmation: true, automaticScanner: true, maintenancePreview: true, localAiContext: true, reducedMotion: false, compactDensity: false };
const readSettings = (): LocalSettings => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch { return defaults; } };

function updateLabel(state: string, copy: SettingsCopy) {
  return ({ development: copy.updateDevelopment, unavailable: copy.updateUnavailable, idle: copy.updateIdle, checking: copy.updateChecking, downloading: copy.updateDownloading, ready: copy.updateReady, installing: copy.updateInstalling, "up-to-date": copy.updateUpToDate, error: copy.updateError } as Record<string, string>)[state] || state;
}

export default function SettingsCenter() {
  const { locale, setLocale } = useLanguage();
  const copy = settingsCopy[locale];
  const [settings, setSettings] = useState<LocalSettings>(readSettings);
  const [notice, setNotice] = useState<string | null>(null);
  const [updateState, setUpdateState] = useState<UpdateState>({ state: "unavailable" });
  const desktopUpdates = window.strayDesktop?.updates;

  useEffect(() => {
    void desktopUpdates?.status().then(setUpdateState).catch(() => setUpdateState({ state: "error" }));
  }, [desktopUpdates]);
  useEffect(() => {
    document.documentElement.dataset.strayMotion = settings.reducedMotion ? "reduce" : "full";
    document.documentElement.dataset.strayDensity = settings.compactDensity ? "compact" : "comfortable";
  }, [settings.compactDensity, settings.reducedMotion]);

  const update = (field: keyof LocalSettings, value: boolean) => {
    const next = { ...settings, [field]: value };
    setSettings(next);
    localStorage.setItem(key, JSON.stringify(next));
    setNotice(copy.savedNotice);
  };
  const reset = () => {
    if (!window.confirm(copy.resetConfirm)) return;
    localStorage.removeItem(key);
    localStorage.removeItem("stray-sync-preferences-v1");
    localStorage.removeItem("theme");
    setSettings(defaults);
    setNotice(copy.resetNotice);
  };
  const checkUpdates = async () => {
    if (!desktopUpdates) return;
    setUpdateState({ state: "checking" });
    setUpdateState(await desktopUpdates.check());
  };

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container max-w-[1440px] technical-grid py-5 md:py-7"><div className="space-y-6"><PageBreadcrumbs items={[{ label: copy.breadcrumbPersonal, href: "/dashboard" }, { label: copy.breadcrumbSettings }]} /><header className="stray-surface rounded-2xl p-5"><p className="stray-kicker">{copy.eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{copy.title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{copy.description}</p></header>{notice ? <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-3 text-sm text-emerald-200">{notice}</p> : null}<section className="grid gap-5 xl:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="h-5 w-5 text-primary" />{copy.appearanceTitle}</CardTitle><CardDescription>{copy.appearanceDescription}</CardDescription></CardHeader><CardContent className="space-y-5"><div className="rounded-xl border bg-black/40 p-4"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium">{copy.blackTheme}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{copy.blackThemeDetail}</p></div><span aria-hidden="true" className="h-3 w-3 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,.08)]" /></div></div><label className="block text-sm font-medium">{copy.language}<select className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm" value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)}>{SUPPORTED_LOCALES.map((item) => <option key={item} value={item}>{localeMeta[item].nativeName}</option>)}</select><span className="mt-2 block text-xs leading-5 text-muted-foreground">{copy.languageHint}</span></label><SwitchRow label={copy.reduceMotion} detail={copy.reduceMotionDetail} checked={settings.reducedMotion} onChange={(value) => update("reducedMotion", value)} /><SwitchRow label={copy.compactDensity} detail={copy.compactDensityDetail} checked={settings.compactDensity} onChange={(value) => update("compactDensity", value)} /></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><ScanLine className="h-5 w-5 text-primary" />{copy.scannerTitle}</CardTitle><CardDescription>{copy.scannerDescription}</CardDescription></CardHeader><CardContent className="space-y-3"><SwitchRow label={copy.automaticScanner} detail={copy.automaticScannerDetail} checked={settings.automaticScanner} onChange={(value) => update("automaticScanner", value)} /><SwitchRow label={copy.gameDiscovery} detail={copy.gameDiscoveryDetail} checked={settings.gameDetection} onChange={(value) => update("gameDetection", value)} /><SwitchRow label={copy.steamConfirmation} detail={copy.steamConfirmationDetail} checked={settings.launchConfirmation} onChange={(value) => update("launchConfirmation", value)} /><SwitchRow label={copy.maintenancePreview} detail={copy.maintenancePreviewDetail} checked={settings.maintenancePreview} onChange={(value) => update("maintenancePreview", value)} /></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" />{copy.aiTitle}</CardTitle><CardDescription>{copy.aiDescription}</CardDescription></CardHeader><CardContent className="space-y-3"><SwitchRow label={copy.localAiContext} detail={copy.localAiContextDetail} checked={settings.localAiContext} onChange={(value) => update("localAiContext", value)} /><SwitchRow label={copy.performanceMonitoring} detail={copy.performanceMonitoringDetail} checked={settings.performanceMonitoring} onChange={(value) => update("performanceMonitoring", value)} /><div className="rounded-xl border border-dashed p-4"><p className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4 text-[color:var(--stray-evidence)]" />{copy.noHiddenCollection}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{copy.noHiddenCollectionDetail}</p></div></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />{copy.privacyTitle}</CardTitle><CardDescription>{copy.privacyDescription}</CardDescription></CardHeader><CardContent className="space-y-3"><PrivacyRow label={copy.localData} value={copy.active} detail={copy.localDataDetail} icon={Eye} /><PrivacyRow label={copy.telemetry} value={copy.disabled} detail={copy.telemetryDetail} icon={CloudOff} /><PrivacyRow label={copy.sharedPerformance} value={copy.disabled} detail={copy.sharedPerformanceDetail} icon={Globe2} /><PrivacyRow label={copy.aiData} value={settings.localAiContext ? copy.localContext : copy.disabled} detail={copy.aiDataDetail} icon={ShieldCheck} /><Link href="/sync"><Button className="mt-2 w-full" variant="outline">{copy.reviewSync}</Button></Link></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />{copy.updatesTitle}</CardTitle><CardDescription>{copy.updatesDescription}</CardDescription></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-muted-foreground"><div className="rounded-xl border bg-card/40 p-3"><p className="font-medium text-foreground">{updateLabel(updateState.state, copy)}</p><p className="mt-1 text-xs leading-5">{updateState.detail || (updateState.state === "error" ? copy.updateQueryError : copy.integrityHint)}{updateState.progress && updateState.state === "downloading" ? ` ${updateState.progress}% ${copy.completeSuffix}` : ""}</p></div><p>{copy.updateExplanation}</p>{desktopUpdates ? <Button className="w-full" onClick={() => void checkUpdates()} disabled={["checking", "downloading", "installing"].includes(updateState.state)}><Download className="mr-2 h-4 w-4" />{copy.checkNow}</Button> : <a className="inline-flex text-primary hover:underline" href="/download">{copy.openDownloads}</a>}<Button className="w-full" variant="outline" onClick={reset}><RefreshCw className="mr-2 h-4 w-4" />{copy.resetPreferences}</Button></CardContent></Card></section></div></main></div>;
}

function SwitchRow({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) { return <div className="flex items-center justify-between gap-4 rounded-xl border p-4"><div><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div><Switch checked={checked} onCheckedChange={onChange} aria-label={label} /></div>; }
function PrivacyRow({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof Eye }) { return <div className="flex gap-3 rounded-xl border bg-card/40 p-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{label}</p><span className="font-tech text-[9px] uppercase tracking-[.1em] text-emerald-300">{value}</span></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div></div>; }
