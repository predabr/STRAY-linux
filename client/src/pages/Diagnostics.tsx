import { PageBreadcrumbs } from "@/components/platform/PageBreadcrumbs";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { assessLinuxGamingEnvironment } from "../../../server/lib/linuxHealth";
import { scannerReportInput, type ScannerReport } from "../../../server/lib/scannerReport";
import { Activity, AlertTriangle, CheckCircle2, DatabaseBackup, Download, FileSearch, RefreshCw, ScanLine, ShieldCheck, Wrench } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Diagnostics() {
  const [scan, setScan] = useState<ScannerReport | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const desktopAvailable = Boolean(window.strayDesktop?.scanner);
  const databaseStatus = trpc.user.localDatabaseStatus.useQuery(undefined, { enabled: desktopAvailable, retry: false });
  const exportLocalData = trpc.user.exportLocalData.useQuery(undefined, { enabled: false, retry: false });
  const run = async () => {
    if (!window.strayDesktop?.scanner) return;
    setRunning(true); setError(null);
    try { setScan(scannerReportInput.parse(await window.strayDesktop.scanner.run())); }
    catch { setError("O Scanner não retornou um relatório técnico válido. Nenhuma alteração foi aplicada ao sistema."); }
    finally { setRunning(false); }
  };
  const findings = scan ? assessLinuxGamingEnvironment(scan) : [];
  const primary = findings[0];
  const exportDiagnostic = async () => {
    if (!desktopAvailable) return;
    setExporting(true);
    setExportError(null);
    try {
      const result = await exportLocalData.refetch();
      if (!result.data) throw new Error("Não foi possível preparar o diagnóstico local.");
      const payload = { schemaVersion: 1, kind: "stray-linux-diagnostic-export", exportedAt: new Date().toISOString(), currentScan: scan, localData: result.data };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `stray-linux-diagnostico-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (cause) {
      setExportError(cause instanceof Error ? cause.message : "Não foi possível exportar o diagnóstico local.");
    } finally {
      setExporting(false);
    }
  };
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container max-w-[1440px] technical-grid py-5 md:py-7"><div className="space-y-6"><PageBreadcrumbs items={[{ label: "Sistema", href: "/dashboard/pc" }, { label: "Diagnóstico" }]} /><header className="stray-surface flex flex-wrap items-end justify-between gap-4 rounded-2xl p-5"><div><p className="stray-kicker">WHAT'S WRONG? / LOCAL DIAGNOSTICS</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Entenda o que o relatório mostra.</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Scan → evidence → diagnosis → recommendation → verify. O Stray explica campos observados, não inventa a causa de um problema e não executa ações automaticamente.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => void exportDiagnostic()} disabled={exporting || !desktopAvailable}><Download className="mr-2 h-4 w-4" />{exporting ? "Preparando…" : "Exportar diagnóstico"}</Button><Button onClick={run} disabled={running || !desktopAvailable}><ScanLine className="mr-2 h-4 w-4" />{running ? "Analisando relatório…" : scan ? "Verificar novamente" : "Executar Scanner local"}</Button></div></header>{!desktopAvailable ? <Card className="border-dashed"><CardContent className="flex flex-col items-center gap-3 p-8 text-center"><FileSearch className="h-7 w-7 text-primary" /><p className="font-medium">Diagnóstico local disponível no aplicativo desktop.</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Abra esta tela no Stray Linux instalado ou use a página Scanner para revisar um relatório JSON gerado localmente.</p><Link href="/scanner"><Button variant="outline">Abrir Scanner</Button></Link></CardContent></Card> : null}{databaseStatus.data?.status === "recovered" ? <Card className="border-amber-400/30 bg-amber-400/[0.05]"><CardContent className="flex gap-3 p-5"><DatabaseBackup className="h-5 w-5 shrink-0 text-amber-200" /><div><p className="font-medium text-amber-100">Banco local recuperado com segurança.</p><p className="mt-1 text-sm leading-6 text-muted-foreground">O Stray preservou o arquivo anterior como backup e recriou a base local. Revise a Central de Recuperação antes de descartar qualquer arquivo antigo.</p></div></CardContent></Card> : null}{databaseStatus.isError ? <Card className="border-destructive/30"><CardContent className="flex gap-3 p-5"><AlertTriangle className="h-5 w-5 shrink-0 text-destructive" /><div><p className="font-medium text-destructive">Não foi possível confirmar o estado do banco local.</p><p className="mt-1 text-sm leading-6 text-muted-foreground">O Stray tentou a reconexão automática. Exporte o diagnóstico quando disponível e abra a Central de Recuperação se o aviso persistir.</p></div></CardContent></Card> : null}{exportError ? <Card className="border-destructive/30"><CardContent className="flex gap-3 p-5 text-sm text-destructive"><AlertTriangle className="h-5 w-5 shrink-0" />{exportError}</CardContent></Card> : null}{error ? <Card className="border-destructive/30"><CardContent className="flex gap-3 p-5 text-sm text-destructive"><AlertTriangle className="h-5 w-5 shrink-0" />{error}</CardContent></Card> : null}{scan && primary ? <DiagnosticResult report={scan} finding={primary} run={run} running={running} /> : scan ? <Card className="border-emerald-400/25 bg-emerald-400/[0.04]"><CardContent className="flex gap-3 p-6"><CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-300" /><div><p className="font-medium text-emerald-200">Nenhum alerta técnico verificável neste relatório.</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Isso não promete compatibilidade ou desempenho: apenas indica que os campos disponíveis não produziram uma recomendação de atenção.</p></div></CardContent></Card> : <EmptyDiagnostic />}</div></main></div>;
}

function EmptyDiagnostic() { return <Card className="border-dashed"><CardContent className="grid gap-4 p-6 md:grid-cols-5">{[["01", "SCAN", "Coleta local e consentida."], ["02", "EVIDENCE", "Campos realmente observados."], ["03", "DIAGNOSIS", "Sinal técnico específico."], ["04", "RECOMMEND", "Próximo passo sem execução."], ["05", "VERIFY", "Nova leitura local."]].map(([id, title, text]) => <div key={id} className="rounded-xl border bg-card/40 p-4"><p className="font-tech text-[10px] tracking-[.14em] text-primary">{id} / {title}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</CardContent></Card>; }

function DiagnosticResult({ report, finding, run, running }: { report: ScannerReport; finding: ReturnType<typeof assessLinuxGamingEnvironment>[number]; run: () => void; running: boolean }) { return <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]"><Card className="border-amber-400/25 bg-amber-400/[0.04]"><CardHeader><p className="evidence-label text-amber-200">PROBLEM DETECTED</p><CardTitle className="mt-1 flex items-center gap-2 text-xl"><AlertTriangle className="h-5 w-5 text-amber-200" />{finding.title}</CardTitle><CardDescription>Confiança: evidência direta do Scanner, limitada aos campos presentes no relatório atual.</CardDescription></CardHeader><CardContent className="space-y-4"><Detail label="EVIDENCE" value={finding.detail} /><Detail label="RECOMMENDED ACTION" value={finding.recommendedAction} /><Detail label="SOURCE" value={`Stray Scan ${report.scannerVersion} · ${new Date(report.generatedAt).toLocaleString("pt-BR")}`} /><p className="rounded-xl border border-white/10 bg-background/60 p-3 text-xs leading-5 text-muted-foreground">Risco: a recomendação pode exigir leitura de documentação da distribuição. O Stray não executa comandos, instala pacotes ou modifica permissões por esta tela.</p><div className="flex flex-wrap gap-3"><Link href="/linuxfix"><Button variant="outline"><Wrench className="mr-2 h-4 w-4" />Consultar LinuxFix</Button></Link><Button onClick={run} disabled={running} variant="secondary"><RefreshCw className="mr-2 h-4 w-4" />Verificar novamente</Button></div></CardContent></Card><Card><CardHeader><p className="evidence-label text-primary">ANALYSIS FLOW</p><CardTitle className="mt-1 text-xl">O que sabemos e o que ainda não sabemos</CardTitle></CardHeader><CardContent className="space-y-3"><Flow title="SCAN" value="Relatório local concluído por ação explícita." icon={ScanLine} /><Flow title="EVIDENCE" value={finding.detail} icon={FileSearch} /><Flow title="DIAGNOSIS" value={finding.title} icon={Activity} /><Flow title="VERIFY" value="Execute novamente após qualquer mudança para comparar apenas leituras reais." icon={ShieldCheck} /></CardContent></Card></section>; }

function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border bg-background/50 p-4"><p className="font-tech text-[9px] tracking-[.13em] text-muted-foreground">{label}</p><p className="mt-2 text-sm leading-6">{value}</p></div>; }
function Flow({ title, value, icon: Icon }: { title: string; value: string; icon: typeof Activity }) { return <div className="flex gap-3 rounded-xl border bg-card/40 p-4"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="font-tech text-[9px] tracking-[.13em] text-primary">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{value}</p></div></div>; }
