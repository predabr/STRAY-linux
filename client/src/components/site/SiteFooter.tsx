import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/landingCopy";

export function SiteFooter({ inverse = false }: { inverse?: boolean }) {
  const { locale } = useLanguage();
  const copy = landingCopy[locale];
  return <footer className={inverse ? "border-t border-black/12 bg-[#d9e4ff] text-black/58" : "border-t border-white/12 bg-[#0b0c10] text-white/55"}><div className="mx-auto flex max-w-[1536px] flex-col gap-3 px-4 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>© 2026 Stray Linux.</span><span>{copy.footerCreator}</span><a href="/uninstall" className="inline-flex items-center gap-1 hover:text-current">{copy.footerUninstall} <ExternalLink className="h-3 w-3" /></a></div></footer>;
}
