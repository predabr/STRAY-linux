import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/landingCopy";
import { distributionAssets } from "@/lib/distribution";
import { releaseManifest } from "@/lib/releaseManifest";

export function WindowsDownloadCard() {
  const { locale } = useLanguage();
  const copy = landingCopy[locale];
  return <article className="group relative overflow-hidden rounded-[1.25rem] bg-[#0b0c10] p-6 text-[#f5f5f0] sm:p-8"><div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#91b7ff]/20 blur-3xl transition-transform duration-500 group-hover:scale-125" aria-hidden="true" /><div className="relative"><p className="font-tech text-[10px] tracking-[.16em] text-white/48">{copy.windowsEyebrow}</p><h3 className="mt-10 text-4xl font-medium leading-none tracking-[-.06em]">{copy.windowsMain}<br />{copy.windowsAccent}</h3><p className="mt-5 max-w-xs text-sm leading-6 text-white/61">{copy.windowsBody}</p><a href={distributionAssets.exe} download={`Stray-Linux-${releaseManifest.version}-Setup.exe`} className="mt-10 flex"><Button className="h-12 w-full rounded-full bg-[#f5f5f0] text-[#0b0c10] hover:bg-[#b7d3ff]"><Download className="mr-2 h-4 w-4" />{copy.downloadExe}</Button></a><p className="mt-5 text-xs leading-5 text-white/42">{copy.windowsFootnote}</p></div></article>;
}
