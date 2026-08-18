import { useAuth } from "@/_core/hooks/useAuth";
import { SiteHeader } from "@/components/platform/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Cloud, LockKeyhole, RefreshCw, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

type Scope = { favorites: boolean; guides: boolean; linuxFixHistory: boolean; profiles: boolean; technicalSnapshot: boolean };

const key = "stray-sync-preferences-v1";

function read(): Scope {
  try {
    return { favorites: true, guides: true, linuxFixHistory: true, profiles: true, technicalSnapshot: false, ...JSON.parse(localStorage.getItem(key) || "{}") };
  } catch {
    return { favorites: true, guides: true, linuxFixHistory: true, profiles: true, technicalSnapshot: false };
  }
}

export default function Sync() {
  const { user, loading } = useAuth();
  const [scope, setScope] = useState<Scope>(read);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);
  const preferences = trpc.user.syncPreferences.get.useQuery(undefined, { enabled: Boolean(user) });
  const save = trpc.user.syncPreferences.update.useMutation();

  useEffect(() => {
    if (!preferences.data) return;
    setScope({
      favorites: preferences.data.syncFavorites,
      guides: preferences.data.syncSavedGuides,
      linuxFixHistory: preferences.data.syncLinuxFixHistory,
      profiles: preferences.data.syncManualProfiles,
      technicalSnapshot: preferences.data.syncTechnicalSnapshot,
    });
  }, [preferences.data]);

  const update = (field: keyof Scope, value: boolean) => {
    if (user && save.isPending) return;
    const previous = scope;
    const next = { ...scope, [field]: value };
    setScope(next);
    localStorage.setItem(key, JSON.stringify(next));
    setFeedback(null);

    if (!user) return;

    save.mutate(
      {
        syncFavorites: next.favorites,
        syncSavedGuides: next.guides,
        syncLinuxFixHistory: next.linuxFixHistory,
        syncManualProfiles: next.profiles,
        syncTechnicalSnapshot: next.technicalSnapshot,
      },
      {
        onSuccess: () => setFeedback("saved"),
        onError: () => {
          setScope(previous);
          localStorage.setItem(key, JSON.stringify(previous));
          setFeedback("error");
        },
      }
    );
  };

  const disabled = Boolean(user) && save.isPending;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container max-w-[1180px] technical-grid py-6">
        <header className="border-b border-white/8 pb-5">
          <p className="font-tech text-[10px] uppercase tracking-[.14em] text-cyan-200">CLOUD SYNC / CONSENTIMENTO</p>
          <h1 className="mt-2 text-3xl font-semibold">Sincronização avançada</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Escolha o escopo da conta. Dados técnicos detalhados e sessões locais permanecem no dispositivo por padrão.</p>
        </header>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Cloud className="h-5 w-5 text-primary" />Escopo da conta</CardTitle>
              <CardDescription>{loading ? "Verificando sessão…" : user ? "O consentimento fica registrado na sua conta; a cópia local só é usada no modo offline." : "Entre na conta para registrar preferências de sincronização."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScopeRow label="Favoritos" detail="Lista pessoal de jogos salvos." checked={scope.favorites} disabled={disabled} onChange={(value) => update("favorites", value)} />
              <ScopeRow label="Guias salvos" detail="Guias marcados para retomar." checked={scope.guides} disabled={disabled} onChange={(value) => update("guides", value)} />
              <ScopeRow label="Histórico LinuxFix" detail="Soluções consultadas pela conta." checked={scope.linuxFixHistory} disabled={disabled} onChange={(value) => update("linuxFixHistory", value)} />
              <ScopeRow label="Perfis manuais" detail="Perfil de hardware cadastrado manualmente." checked={scope.profiles} disabled={disabled} onChange={(value) => update("profiles", value)} />
              <ScopeRow label="Snapshot técnico" detail="Desativado por padrão; requer importação explícita no Scanner." checked={scope.technicalSnapshot} disabled={disabled} onChange={(value) => update("technicalSnapshot", value)} />

              {feedback === "saved" ? <p className="flex items-center gap-2 text-xs text-emerald-300" role="status"><CheckCircle2 className="h-4 w-4" />Preferência salva na conta.</p> : null}
              {feedback === "error" ? <p className="flex items-center gap-2 text-xs text-destructive" role="alert"><TriangleAlert className="h-4 w-4" />Não foi possível salvar. A alteração foi desfeita.</p> : null}
              {preferences.isError ? <p className="flex items-center gap-2 text-xs text-destructive" role="alert"><TriangleAlert className="h-4 w-4" />Não foi possível atualizar as preferências da conta.</p> : null}

              <Button variant="outline" className="w-full" disabled={!user || save.isPending || preferences.isFetching} onClick={() => { setFeedback(null); preferences.refetch(); }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {save.isPending ? "Salvando consentimento…" : preferences.isFetching ? "Atualizando preferências…" : "Atualizar preferências da conta"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5 text-primary" />Limites atuais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-3 text-amber-100"><strong>Preferências, não conteúdo.</strong><br />Esta versão registra somente o escopo consentido na conta; ela não executa sincronização bidirecional de conteúdo ou resolução de conflitos entre dispositivos.</p>
              <p>O Stray Linux não faz merge silencioso de perfis. Uma sincronização bidirecional só pode ser adicionada depois que as versões local e da conta forem mostradas para escolha explícita do usuário.</p>
              <p>Relatórios completos do Scanner, sessões de performance, controles e inventário de mods não são enviados automaticamente.</p>
              <p>Desativar um escopo impede novas sincronizações daquele tipo; não apaga registros já existentes na conta. A exclusão é uma ação separada e confirmada.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function ScopeRow({ label, detail, checked, disabled, onChange }: { label: string; detail: string; checked: boolean; disabled: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl border p-4"><div><p className="font-medium">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div><Switch checked={checked} disabled={disabled} onCheckedChange={onChange} aria-label={label} /></div>;
}
