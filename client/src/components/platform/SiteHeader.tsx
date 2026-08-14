import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useTheme } from "@/contexts/ThemeContext";
import { localeMeta, SUPPORTED_LOCALES, useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { StrayBrandMark } from "@/components/platform/StrayBrandMark";
import { GlobalCommandPalette } from "@/components/platform/GlobalCommandPalette";
import { atlasNavigationCopy } from "@/i18n/atlasNavigationCopy";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronDown, Languages, Menu, Moon, Search, Sun, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const directNavigation = [
  { key: "gameHub" as const, href: "/games" },
  { key: "distros" as const, href: "/distros" },
  { key: "assistant" as const, href: "/assistant" },
];
const guideNavigation = [
  { key: "wiki" as const, href: "/wiki" },
  { key: "setup" as const, href: "/setup" },
  { key: "linuxFix" as const, href: "/linuxfix" },
];
const toolNavigation = [
  { key: "benchmark" as const, href: "/benchmark" },
  { key: "windows" as const, href: "/windows" },
];
const allNavigation = [...directNavigation.slice(0, 2), ...guideNavigation, ...toolNavigation, directNavigation[2]!];

export function SiteHeader() {
  const [location, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const copy = atlasNavigationCopy[locale];
  const [commandOpen, setCommandOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = (href: string) => location === href || (href !== "/games" && location.startsWith(`${href}/`));
  const groupActive = (items: readonly { href: string }[]) => items.some((item) => active(item.href));

  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
    <div className="container flex h-16 items-center gap-3">
      <StrayBrandMark />
      <nav aria-label="Navegação principal" className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
        <HeaderLink href="/games" active={active("/games")}>{t("gameHub")}</HeaderLink>
        <HeaderLink href="/distros" active={active("/distros")}>{t("distros")}</HeaderLink>
        <HeaderGroup label={copy.guides} active={groupActive(guideNavigation)} items={guideNavigation} />
        <HeaderGroup label={copy.tools} active={groupActive(toolNavigation)} items={toolNavigation} />
        <HeaderLink href="/assistant" active={active("/assistant")}>{t("assistant")}</HeaderLink>
      </nav>
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="sm" className="hidden gap-2 sm:inline-flex" onClick={() => setCommandOpen(true)} aria-label={t("openSearch")}>
          <Search className="h-4 w-4" /><span className="hidden xl:inline">{t("search")}</span><kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground xl:inline">⌘K</kbd>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={t("language")}><Languages className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end"><DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as typeof locale)}>{SUPPORTED_LOCALES.map((item) => <DropdownMenuRadioItem key={item} value={item}>{localeMeta[item].nativeName}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup></DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={t("theme")}>{resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end"><DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}><DropdownMenuRadioItem value="dark">{t("dark")}</DropdownMenuRadioItem><DropdownMenuRadioItem value="light">{t("light")}</DropdownMenuRadioItem><DropdownMenuRadioItem value="system">{t("system")}</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent>
        </DropdownMenu>
        {!loading && (user ? <Button size="sm" onClick={() => setLocation("/dashboard")}><UserRound className="mr-2 h-4 w-4" />{t("dashboard")}</Button> : <Button size="sm" onClick={() => startLogin()}>{t("signIn")}</Button>)}
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={copy.openMenu} onClick={() => setMenuOpen(true)}><Menu className="h-4 w-4" /></Button>
      </div>
    </div>
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
      <SheetContent side="right" className="w-[min(22rem,88vw)] p-0">
        <SheetHeader><SheetTitle>{copy.menuTitle}</SheetTitle><SheetDescription>{copy.menuDescription}</SheetDescription></SheetHeader>
        <nav aria-label="Navegação móvel" className="flex flex-col gap-1 px-4 pb-6">
          {allNavigation.map((item) => <SheetClose key={item.href} asChild><Link href={item.href} className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${active(item.href) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}>{t(item.key)}</Link></SheetClose>)}
        </nav>
      </SheetContent>
    </Sheet>
    <GlobalCommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
  </header>;
}

function HeaderLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return <Link href={href} className={`rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`}>{children}</Link>;
}

function HeaderGroup({ label, active, items }: { label: string; active: boolean; items: readonly { key: "wiki" | "setup" | "linuxFix" | "benchmark" | "windows"; href: string }[] }) {
  const { t } = useLanguage();
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className={`gap-1 ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`}>{label}<ChevronDown className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="center">{items.map((item) => <DropdownMenuItem key={item.href} asChild><Link href={item.href}>{t(item.key)}</Link></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>;
}
