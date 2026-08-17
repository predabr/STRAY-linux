import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/landingCopy";
import { DownloadPanel } from "@/components/site/DownloadPanel";
import { LandingEvidence } from "@/components/site/LandingEvidence";
import { LandingMethod } from "@/components/site/LandingMethod";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHero } from "@/components/site/SiteHero";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteTrustGrid } from "@/components/site/SiteTrustGrid";
import "@/styles/site-editorial.css";

export default function Home() {
  const { locale } = useLanguage();
  const copy = landingCopy[locale];
  return <div id="top" className="min-h-screen overflow-x-hidden bg-[#f0f0ec] text-[#0b0c10] selection:bg-[#0b0c10] selection:text-white"><SiteNav /><main><SiteHero copy={copy} /><LandingMethod copy={copy} /><SiteTrustGrid /><section className="bg-[#15161b] px-4 py-4 sm:px-6 lg:px-8"><div className="editorial-marquee overflow-hidden py-3 text-[clamp(1.9rem,4vw,4.4rem)] font-semibold leading-none tracking-[-.06em] text-[#f0f0ec]" aria-label={copy.marquee}><div className="editorial-marquee-track">{copy.marquee} <span>{copy.marquee}</span></div></div></section><section id="downloads" className="bg-[#d9e4ff] px-4 py-20 sm:px-6 sm:py-28 lg:px-8"><div className="mx-auto max-w-[1536px]"><div className="grid gap-8 border-b border-black/15 pb-10 lg:grid-cols-[.75fr_1.25fr] lg:items-end"><div><p className="font-tech text-[10px] font-bold tracking-[.2em] text-black/50">{copy.downloadsEyebrow}</p><p className="mt-5 max-w-xs text-sm leading-6 text-black/60">{copy.downloadsLead}</p></div><h2 className="font-serif text-5xl leading-[.9] tracking-[-.07em] sm:text-7xl">{copy.downloadsMain}<br /><em className="font-normal">{copy.downloadsAccent}</em></h2></div><DownloadPanel /><p className="mt-6 text-sm text-black/62">{copy.uninstallLead}</p></div></section><LandingEvidence copy={copy} /></main><SiteFooter /></div>;
}

export function DownloadPage() {
  const { locale } = useLanguage();
  const copy = landingCopy[locale];
  return <div className="min-h-screen bg-[#d9e4ff] text-[#0b0c10]"><SiteNav inverse /><main className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto max-w-[1536px]"><p className="font-tech text-[10px] font-bold tracking-[.2em] text-black/50">{copy.downloadsEyebrow}</p><h1 className="mt-5 max-w-4xl font-serif text-6xl leading-[.82] tracking-[-.08em] sm:text-8xl">{copy.downloadsMain}<br /><em className="font-normal">{copy.downloadsAccent}</em></h1><p className="mt-8 max-w-2xl text-base leading-8 text-black/62">{copy.downloadsLead}</p><DownloadPanel /></div></main><SiteFooter inverse /></div>;
}
