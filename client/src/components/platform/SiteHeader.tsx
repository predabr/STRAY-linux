import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Gamepad2, Menu, Moon, Search, Sun, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";

const navigation = [
  { label: "GameHub", href: "/games" },
  { label: "Benchmark", href: "/benchmark" },
  { label: "Wiki", href: "/wiki" },
  { label: "LinuxFix", href: "/linuxfix" },
  { label: "Setup", href: "/setup" },
  { label: "Assistente", href: "/assistant" },
];

export function SiteHeader() {
  const [location, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();

  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
    <div className="container flex h-16 items-center gap-3">
      <Link href="/" className="group flex shrink-0 items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_28px_-7px_hsl(var(--primary))] transition-transform duration-200 group-hover:scale-105"><Gamepad2 className="h-5 w-5" /></span>
        <span className="hidden font-semibold tracking-tight sm:block">Linux <span className="text-primary">Gaming</span> Hub</span>
      </Link>
      <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
        {navigation.map((item) => <Link key={item.href} href={item.href} className={`rounded-lg px-3 py-2 text-sm transition-colors ${location === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`}>{item.label}</Link>)}
      </nav>
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="hidden sm:inline-flex" onClick={() => setLocation("/search")} aria-label="Pesquisar"><Search className="h-4 w-4" /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Alternar tema">{resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end"><DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}><DropdownMenuRadioItem value="dark">Escuro</DropdownMenuRadioItem><DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem><DropdownMenuRadioItem value="system">Sistema</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent>
        </DropdownMenu>
        {!loading && (user ? <Button size="sm" onClick={() => setLocation("/dashboard")}><UserRound className="mr-2 h-4 w-4" />Painel</Button> : <Button size="sm" onClick={() => startLogin()}>Entrar</Button>)}
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir pesquisa" onClick={() => setLocation("/search")}><Menu className="h-4 w-4" /></Button>
      </div>
    </div>
  </header>;
}
