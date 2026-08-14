import { SiteHeader } from "@/components/platform/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { distroProfileCopy } from "@/i18n/distroProfileCopy";
import { distroRegistry, type DistroRegistryEntry } from "@shared/distro-registry";
import { AlertTriangle, ArrowLeft, Check, CheckCircle2, Copy, ExternalLink, ShieldCheck, Terminal } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useRoute } from "wouter";

const formatMatrixUrl = "https://www.electron.build/docs/linux/";
const bigLinuxDownloadUrl = "https://www.biglinux.com.br/download/";
const bigLinuxCommunityUrl = "https://forum.biglinux.com.br/";

type InstallationProfile = { artifact: string; validate: string; install: string; update: string; warning: string };

function profileFor(entry: DistroRegistryEntry): InstallationProfile {
  const byInstaller: Record<string, InstallationProfile> = {
    pacman: { artifact: ".pacman", validate: "cat /etc/os-release && uname -m", install: "sudo pacman -U ./Stray-Linux-1.0.0-x64.pacman", update: "sudo pacman -Syu", warning: "Faça uma atualização completa antes da instalação. Não sincronize os repositórios sem atualizar o sistema." },
    apt: { artifact: ".deb", validate: "cat /etc/os-release && dpkg --print-architecture", install: "sudo apt install ./Stray-Linux-1.0.0-amd64.deb", update: "sudo apt update && sudo apt upgrade", warning: "Instale somente o pacote da arquitetura correta e não misture repositórios de Debian e Ubuntu." },
    dnf: { artifact: ".rpm", validate: "cat /etc/os-release && uname -m", install: "sudo dnf install ./Stray-Linux-1.0.0-x86_64.rpm", update: "sudo dnf upgrade --refresh", warning: "O RPM se aplica às variantes tradicionais; em sistemas Atomic use a rota imutável ou portátil." },
    zypper: { artifact: ".rpm", validate: "cat /etc/os-release && uname -m", install: "sudo zypper install ./Stray-Linux-1.0.0-x86_64.rpm", update: "sudo zypper refresh && sudo zypper update", warning: "Não instale pacotes de outra release ou de outra família RPM." },
    "flatpak-or-appimage": { artifact: ".AppImage", validate: "cat /etc/os-release && uname -m", install: "chmod +x ./Stray-Linux-1.0.0-x86_64.AppImage && ./Stray-Linux-1.0.0-x86_64.AppImage", update: "flatpak update", warning: "A base é transacional. Não sobreponha pacotes do sistema para instalar o aplicativo." },
    apk: { artifact: ".apk", validate: "cat /etc/os-release && uname -m", install: "sudo apk add --allow-untrusted ./Stray-Linux-1.0.0-x86_64.apk", update: "sudo apk upgrade", warning: "O APK exige um build publicado especificamente para Alpine e para a mesma arquitetura." },
  };
  return byInstaller[entry.installer ?? ""] ?? { artifact: ".AppImage", validate: "cat /etc/os-release && uname -m", install: "chmod +x ./Stray-Linux-1.0.0-x86_64.AppImage && ./Stray-Linux-1.0.0-x86_64.AppImage", update: "# Consulte a documentação oficial desta distribuição", warning: "Esta entrada não possui um pacote nativo genérico seguro. Use somente um artefato cuja compatibilidade tenha sido verificada para a distribuição, arquitetura e release." };
}

function editorialLinksFor(entry: DistroRegistryEntry) {
  if (!entry.name.toLowerCase().startsWith("zorin os")) return [];
  return [
    { href: "/wiki/zorin-os-gaming-reference", label: "Referência Zorin OS para gaming", description: "Versão, atualização, drivers, Vulkan e limites de compatibilidade." },
    { href: "/setup/zorin-steam-flatpak", label: "Instalar Steam via Flatpak", description: "Passos e comando do aplicativo com fonte registrada." },
    { href: "/setup/zorin-nvidia-driver-gaming", label: "Ativar NVIDIA para gaming", description: "Fluxo Additional Drivers e cuidados com Secure Boot." },
  ];
}

export default function DistroProfile() {
  const [, params] = useRoute("/distros/:id");
  const [, setLocation] = useLocation();
  const { locale } = useLanguage();
  const copy = distroProfileCopy[locale];
  const entry = distroRegistry.entries.find((item) => item.id === params?.id);
  const [copied, setCopied] = useState<string>();

  if (!entry) return <div className="min-h-screen bg-background"><SiteHeader /><main className="container py-20"><h1 className="text-3xl font-semibold">Perfil não encontrado</h1><Button className="mt-5" onClick={() => setLocation("/distros")}>{copy.backToAtlas}</Button></main></div>;

  const profile = profileFor(entry);
  const editorialLinks = editorialLinksFor(entry);
  const blocked = entry.support === "historical" || entry.support === "reference-only";
  const isBigLinux = entry.name === "BigLinux";
  const copyCommand = async (key: string, value: string) => {
    await navigator.clipboard?.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(undefined), 1500);
  };

  return <div className="min-h-screen bg-background text-foreground"><SiteHeader /><main className="container technical-grid py-8 md:py-12">
    <Link href="/distros" className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="mr-2 h-4 w-4" />{copy.backToAtlas}</Link>

    <article className="diagnostic-panel mt-5 overflow-hidden rounded-3xl border border-primary/20 p-6 md:p-9">
      <div className="relative z-10"><p className="evidence-label text-primary">{copy.eyebrow}</p><div className="mt-4 flex flex-wrap items-start justify-between gap-5"><div className="max-w-3xl"><h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{entry.name}</h1><p className="mt-3 text-lg leading-8 text-muted-foreground">{copy.profilePurpose}</p></div><Badge variant="outline" className="border-primary/30 bg-primary/10 px-3 py-1.5 text-primary">{entry.support === "package-family" ? copy.selectPackage : copy.continueSafely}</Badge></div>
        <section aria-label={copy.overview} className="mt-8 grid gap-3 sm:grid-cols-3"><InfoTile label={copy.family} value={entry.family} /><InfoTile label={copy.format} value={blocked ? "—" : profile.artifact} /><InfoTile label={copy.policy} value={copy.familyPrefix} /></section>
      </div>
    </article>

    {isBigLinux ? <section className="mt-6 rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-5 md:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div className="max-w-3xl"><p className="evidence-label text-emerald-300">BIGLINUX / BRASIL</p><h2 className="mt-2 text-2xl font-semibold">{copy.bigLinuxTitle}</h2><p className="mt-3 leading-7 text-muted-foreground">{copy.bigLinuxText}</p></div><ShieldCheck className="h-8 w-8 shrink-0 text-emerald-300" /></div><div className="mt-5 grid gap-3 md:grid-cols-2"><FactRow>{copy.bigLinuxLive}</FactRow><FactRow>{copy.bigLinuxGaming}</FactRow></div><div className="mt-5 flex flex-wrap gap-3"><ExternalResource href={bigLinuxDownloadUrl} label={copy.bigLinuxDownload} /><ExternalResource href={bigLinuxCommunityUrl} label={copy.bigLinuxCommunity} /></div></section> : null}

    {blocked ? <section className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5"><div className="flex gap-3"><AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" /><div><h2 className="font-semibold">{copy.noInstallerTitle}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.noInstallerText}</p></div></div></section> : <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)]"><div className="space-y-5"><section className="rounded-3xl border bg-card/80 p-5 md:p-6"><p className="evidence-label text-primary">{copy.route}</p><h2 className="mt-2 text-2xl font-semibold">{copy.commands}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.routeIntro}</p><ol className="mt-6 grid gap-3"><RouteStep number="01" title={copy.checkSystem} detail={copy.identifySystem} target="#commands" /><RouteStep number="02" title={copy.selectPackage} detail={copy.installArtifact(profile.artifact)} target="#commands" /><RouteStep number="03" title={copy.continueSafely} detail={copy.updateFamily} target="#commands" /></ol></section>
        <section id="commands" className="scroll-mt-24 rounded-3xl border border-primary/15 bg-card/80 p-5 md:p-6"><p className="evidence-label text-primary">{copy.commands}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.commandsIntro}</p><div className="mt-5 space-y-3"><CommandCard title={copy.identifySystem} command={profile.validate} copied={copied === "validate"} onCopy={() => copyCommand("validate", profile.validate)} copy={copy} /><CommandCard title={copy.installArtifact(profile.artifact)} command={profile.install} copied={copied === "install"} onCopy={() => copyCommand("install", profile.install)} copy={copy} /><CommandCard title={copy.updateFamily} command={profile.update} copied={copied === "update"} onCopy={() => copyCommand("update", profile.update)} copy={copy} /></div></section>
      </div><aside className="space-y-5 lg:sticky lg:top-24 lg:self-start"><section className="rounded-3xl border bg-card/80 p-5"><ShieldCheck className="h-6 w-6 text-primary" /><h2 className="mt-4 text-lg font-semibold">{copy.safety}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{profile.warning}</p><a href={formatMatrixUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center text-sm font-medium text-primary hover:underline">{copy.format} <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></a></section><section className="rounded-3xl border border-dashed p-5"><p className="evidence-label text-primary">{copy.source}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.sourceText}</p></section></aside></section>}

    {editorialLinks.length ? <section className="mt-7 rounded-3xl border border-primary/20 bg-card/80 p-5"><p className="evidence-label text-primary">ZORIN OS</p><div className="mt-4 grid gap-3 md:grid-cols-3">{editorialLinks.map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-border/80 bg-background/50 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"><p className="font-medium text-foreground">{item.label}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{item.description}</p></Link>)}</div></section> : null}
  </main></div>;
}

function InfoTile({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-border/70 bg-background/45 p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-2 font-medium">{value}</p></div>; }
function FactRow({ children }: { children: string }) { return <p className="flex gap-2 rounded-2xl border border-emerald-500/15 bg-background/35 p-4 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{children}</p>; }
function ExternalResource({ href, label }: { href: string; label: string }) { return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-xl border border-emerald-500/25 bg-background/50 px-4 py-2.5 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-500/10">{label}<ExternalLink className="ml-2 h-3.5 w-3.5" /></a>; }
function RouteStep({ number, title, detail, target }: { number: string; title: string; detail: string; target: string }) { return <a href={target} className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-background/45 p-4 transition-colors hover:border-primary/35 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="font-mono text-xs text-primary">{number}</span><span className="min-w-0 flex-1"><span className="block font-medium">{title}</span><span className="mt-1 block text-sm text-muted-foreground">{detail}</span></span><ArrowLeft className="h-4 w-4 rotate-180 text-primary transition-transform group-hover:translate-x-0.5" /></a>; }
function CommandCard({ title, command, copied, onCopy, copy }: { title: string; command: string; copied: boolean; onCopy: () => void; copy: typeof distroProfileCopy["pt-BR"] }) { return <div className="rounded-2xl border bg-background/55 p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-medium">{title}</h3><Button variant="outline" size="sm" onClick={onCopy}>{copied ? <Check className="mr-2 h-3.5 w-3.5 text-emerald-400" /> : <Copy className="mr-2 h-3.5 w-3.5" />}{copied ? copy.copied : copy.copy}</Button></div><pre className="mt-4 overflow-x-auto rounded-xl border bg-background/70 p-4 font-mono text-xs text-foreground"><Terminal className="mr-2 inline h-3.5 w-3.5 text-primary" />{command}</pre></div>; }
