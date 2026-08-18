import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="technical-grid flex min-h-screen w-full items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg border-border bg-card/95 shadow-2xl shadow-black/20 backdrop-blur-sm">
        <CardContent className="p-8 text-center sm:p-10">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
              <AlertCircle className="h-8 w-8" aria-hidden="true" />
            </div>
          </div>

          <p className="mt-6 font-tech text-[10px] uppercase tracking-[.16em] text-muted-foreground">STRAY LINUX / ROTA INDISPONÍVEL</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">404</h1>
          <h2 className="mt-2 text-xl font-semibold">Esta página não foi encontrada.</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">O endereço pode estar incorreto, ter sido movido ou não estar disponível neste modo do aplicativo.</p>

          <div id="not-found-button-group" className="mt-7 flex justify-center">
            <Button onClick={() => setLocation("/")}>
              <Home className="mr-2 h-4 w-4" />
              Ir para o início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
