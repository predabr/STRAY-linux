import { PageBreadcrumbs } from "@/components/platform/PageBreadcrumbs";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, FileJson2, LockKeyhole, MonitorCog, TerminalSquare, Upload } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

type ScanReport = {
  schemaVersion: 1;
  scannerVersion: string;
  generatedAt: string;
  system: {
    distribution: { id: string | null; name: string | null; version: string | null };
    kernelVersion: string | null;
    cpu: { model: string | null };
    gpu: { model: string | null; vramMb: number | null };
    memoryGb: number | null;
    graphics: { driverVersion: string | null; mesaVersion: string | null; vulkanVersion: string | null; openGlVersion: string | null };
    runtime: { wineVersion: string | null; protonVersion: string | null; steamDetected: boolean };
  };
};

function isScanReport(value: unknown): value is ScanReport {
  const candidate = value as ScanReport | null;
  return Boolean(candidate && candidate.schemaVersion === 1 && candidate.scannerVersion && candidate.generatedAt && candidate.system?.distribution && candidate.system?.cpu && candidate.system?.gpu && candidate.system?.graphics && candidate.system?.runtime);
}

export default function Scanner() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const [, setLocation] = useLocation();
  const [scan, setScan] = useState<ScanReport | null>(null);
  const [profileName, setProfileName] = useState("Perfil importado pelo Stray Scan");
  const [error, setError] = useState<string | null>(null);
  const importScan = trpc.user.profiles.importScan.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.user.profiles.list.invalidate(), utils.user.dashboard.invalidate(), utils.user.recommendations.invalidate()]);
      setLocation("/dashboard/pc");
    },
  });

  async function previewFile(file: File | undefined) {
    setError(null);
    setScan(null);
    if (!file) return;
    if (file.size > 256 * 1024) { setError("O relatório excede 256 KB. O Stray Scan gera somente um JSON técnico pequeno."); return; }
    try {
      const parsed = JSON.parse(await file.text());
      if (!isScanReport(parsed)) throw new Error("formato");
      setScan(parsed);
    } catch {
      setError("Arquivo inválido. Gere um novo relatório com stray-scan --pretty --output stray-system-report.json.");
    }
  }

  return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-8 md:py-12"><div className="mx-auto max-w-5xl space-y-6"><PageBreadcrumbs items={[{ label: "Stray Linux", href: "/" }, { label: "Scanner local" }]} /><section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><Card className="border-primary/20 bg-primary/[0.025]"><CardHeader><p className="evidence-label text-primary">STRAY SCAN / CONSENTIMENTO EXPLÍCITO</p><CardTitle className="mt-2 text-3xl">Transforme o relatório local em um perfil de PC.</CardTitle><CardDescription className="max-w-2xl text-sm leading-6">O scanner roda no Linux do usuário e cria um JSON para revisão. Esta página só envia os campos exibidos depois que você clicar em importar.</CardDescription></CardHeader><CardContent><div className="rounded-xl border border-dashed bg-background/60 p-4 font-mono text-xs leading-6 text-muted-foreground"><span className="text-primary">$</span> node desktop/bin/stray-scan.cjs --pretty --output stray-system-report.json</div><label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-sm font-medium transition-colors hover:bg-accent"><Upload className="h-4 w-4 text-primary" />Selecionar relatório JSON<input className="sr-only" type="file" accept="application/json,.json" onChange={(event) => previewFile(event.target.files?.[0])} /></label>{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><LockKeyhole className="h-5 w-5 text-primary" />O que o relatório não contém</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-muted-foreground"><p>Hostname, nome de usuário, serial, ID de máquina, token Steam, lista de jogos e arquivos pessoais ficam fora do contrato.</p><p>Dados não localizados permanecem como não informados. O sistema não fabrica versões de driver, Proton ou hardware.</p><p>O relatório não cria benchmark, nota de compatibilidade ou publicação comunitária.</p></CardContent></Card></section>{scan ? <section className="grid gap-5 lg:grid-cols-[1fr_.75fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><FileJson2 className="h-5 w-5 text-primary" />Prévia para revisão</CardTitle><CardDescription>Gerado em {new Date(scan.generatedAt).toLocaleString("pt-BR")} pelo Stray Scan {scan.scannerVersion}.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><DataRow label="Distribuição" value={[scan.system.distribution.name, scan.system.distribution.version].filter(Boolean).join(" ") || "Não informada"} /><DataRow label="Kernel" value={scan.system.kernelVersion || "Não informado"} /><DataRow label="CPU" value={scan.system.cpu.model || "Não informada"} /><DataRow label="GPU" value={scan.system.gpu.model || "Não informada"} /><DataRow label="RAM" value={scan.system.memoryGb ? `${scan.system.memoryGb} GB` : "Não informada"} /><DataRow label="Driver" value={scan.system.graphics.driverVersion || "Não informado"} /><DataRow label="Mesa / Vulkan" value={[scan.system.graphics.mesaVersion ? `Mesa ${scan.system.graphics.mesaVersion}` : null, scan.system.graphics.vulkanVersion ? `Vulkan ${scan.system.graphics.vulkanVersion}` : null].filter(Boolean).join(" · ") || "Não informado"} /><DataRow label="Steam / Wine" value={`${scan.system.runtime.steamDetected ? "Steam detectado" : "Steam não detectado"}${scan.system.runtime.wineVersion ? ` · ${scan.system.runtime.wineVersion}` : ""}`} /></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><MonitorCog className="h-5 w-5 text-primary" />Importar perfil</CardTitle><CardDescription>Você pode editar ou excluir esse perfil depois no dashboard.</CardDescription></CardHeader><CardContent className="space-y-3"><Input value={profileName} onChange={(event) => setProfileName(event.target.value)} aria-label="Nome do perfil" />{!loading && !user ? <Button className="w-full" onClick={() => startLogin()}><LockKeyhole className="mr-2 h-4 w-4" />Entrar para importar</Button> : <Button className="w-full" disabled={!profileName.trim() || importScan.isPending} onClick={() => importScan.mutate({ name: profileName, isActive: true, scan })}>{importScan.isPending ? "Importando…" : "Confirmar e importar perfil"}</Button>}{importScan.isError ? <p className="text-sm text-destructive">Não foi possível importar o relatório. Revise o arquivo e tente novamente.</p> : null}</CardContent></Card></section> : <Card className="border-dashed"><CardContent className="flex flex-col items-center gap-3 p-8 text-center"><TerminalSquare className="h-7 w-7 text-primary" /><p className="font-medium">Nenhum relatório selecionado</p><p className="max-w-xl text-sm leading-6 text-muted-foreground">Execute o comando na sua máquina Linux, confira o JSON e selecione o arquivo aqui. A prévia aparecerá antes de qualquer gravação no perfil.</p></CardContent></Card>}<Card><CardContent className="flex gap-3 p-5 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />O scanner foi projetado para perfil técnico e compatibilidade contextual. Uma correspondência com o catálogo ou um resultado de compatibilidade só ocorrerá quando houver evidência publicada para os campos disponíveis.</CardContent></Card></div></main></div>;
}

function DataRow({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border bg-card/40 p-3"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium text-foreground">{value}</p></div>; }
