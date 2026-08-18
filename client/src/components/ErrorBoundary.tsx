import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, ShieldCheck } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <p className="font-tech text-[10px] tracking-[.18em] text-primary">STRAY LINUX / RECUPERAÇÃO SEGURA</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-.04em]">Não foi possível carregar esta tela.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Nenhum dado do sistema foi alterado. Recarregue o aplicativo para tentar novamente. Se o problema persistir, consulte os relatórios locais.</p>

            <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />Detalhes técnicos não são exibidos nesta tela.</div>

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "mt-6 flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Recarregar aplicativo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
