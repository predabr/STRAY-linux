import { useEffect } from "react";
import { useLocation } from "wouter";

const defaults = {
  title: "Stray Linux — Central de gaming e configuração Linux",
  description: "Dados rastreáveis de Linux gaming, Atlas de distribuições, guias técnicos, LinuxFix e benchmarks com proveniência.",
};

function metaFor(path: string) {
  if (path.startsWith("/games")) return { title: "GameHub | Stray Linux", description: "Catálogo de jogos com compatibilidade por ambiente, fontes e benchmarks verificáveis." };
  if (path.startsWith("/benchmark")) return { title: "PC Benchmark | Stray Linux", description: "Consulte benchmarks verificáveis por jogo, hardware, distribuição e runtime." };
  if (path.startsWith("/windows")) return { title: "Windows | Stray Linux", description: "Comandos Windows verificados para diagnóstico, manutenção segura, reparo e aplicativos úteis." };
  if (path.startsWith("/distros")) return { title: "Atlas de Distribuições | Stray Linux", description: "Explore o Atlas de distribuições, famílias de pacote e comandos de instalação do Stray Linux." };
  if (path.startsWith("/wiki")) return { title: "Linux Wiki | Stray Linux", description: "Referências técnicas de Linux com fonte, versão e escopo de distribuição explícitos." };
  if (path.startsWith("/setup")) return { title: "Linux Setup | Stray Linux", description: "Guias técnicos com comandos copiáveis, avisos e progresso por etapa." };
  if (path.startsWith("/linuxfix")) return { title: "LinuxFix | Stray Linux", description: "Diagnósticos, soluções e feedback de uso para problemas de Linux gaming." };
  if (path.startsWith("/assistant")) return { title: "Assistente | Stray Linux", description: "Assistente contextual para dúvidas sobre Linux gaming e configuração." };
  return defaults;
}

function upsert(selector: string, attribute: "name" | "property", value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, selector.match(/="([^"]+)"/)?.[1] ?? ""); document.head.appendChild(element); }
  element.content = value;
}

export function RouteMeta() {
  const [location] = useLocation();
  useEffect(() => {
    const meta = metaFor(location);
    const url = new URL(location, window.location.origin).toString();
    document.title = meta.title;
    upsert('meta[name="description"]', "name", meta.description);
    upsert('meta[property="og:title"]', "property", meta.title);
    upsert('meta[property="og:description"]', "property", meta.description);
    upsert('meta[property="og:url"]', "property", url);
    upsert('meta[name="twitter:title"]', "name", meta.title);
    upsert('meta[name="twitter:description"]', "name", meta.description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = url;
    let schema = document.getElementById("stray-linux-schema");
    if (!schema) { schema = document.createElement("script"); schema.id = "stray-linux-schema"; schema.setAttribute("type", "application/ld+json"); document.head.appendChild(schema); }
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Stray Linux", applicationCategory: "UtilitiesApplication", operatingSystem: "Linux, Windows", url, description: meta.description, inLanguage: "pt-BR" });
  }, [location]);
  return null;
}
