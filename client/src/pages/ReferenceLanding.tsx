import { distributionAssets } from "@/lib/distribution";

type Hotspot = {
  label: string;
  href: string;
  left: string;
  top: string;
  width: string;
  height: string;
  download?: string;
};

const hotspots: Hotspot[] = [
  { label: "Abrir downloads", href: "/download", left: "66.2%", top: "0.8%", width: "7.8%", height: "1.7%" },
  { label: "Abrir aplicativo", href: "/dashboard", left: "74.4%", top: "0.8%", width: "5.5%", height: "1.7%" },
  { label: "Abrir documentação pública", href: "/api/docs", left: "80.1%", top: "0.8%", width: "4.5%", height: "1.7%" },
  { label: "Baixar Stray Linux para Windows", href: distributionAssets.exe, left: "2.8%", top: "12.8%", width: "13.2%", height: "1.8%", download: "Stray-Linux-1.0.0-Setup.exe" },
  { label: "Abrir visão geral do aplicativo", href: "/dashboard", left: "16.9%", top: "12.8%", width: "13.1%", height: "1.8%" },
  { label: "Ver meu sistema no Scanner", href: "/scanner", left: "4.6%", top: "37.2%", width: "12.1%", height: "1.7%" },
  { label: "Explorar GameHub", href: "/games", left: "49.1%", top: "49.0%", width: "12.4%", height: "1.8%" },
  { label: "Ver perfil de jogo", href: "/games", left: "49.2%", top: "55.5%", width: "13.3%", height: "1.8%" },
  { label: "Abrir biblioteca local", href: "/library", left: "36.0%", top: "5.1%", width: "20.8%", height: "1.8%" },
  { label: "Abrir guias de instalação", href: "/setup", left: "24.2%", top: "91.8%", width: "17.0%", height: "1.8%" },
  { label: "Explorar benchmarks", href: "/benchmark", left: "4.7%", top: "63.8%", width: "12.4%", height: "1.8%" },
  { label: "Ver soluções LinuxFix", href: "/linuxfix", left: "5.0%", top: "78.6%", width: "17.6%", height: "1.8%" },
  { label: "Abrir Stray AI", href: "/assistant", left: "26.7%", top: "78.6%", width: "19.4%", height: "1.8%" },
  { label: "Experimentar Stray AI", href: "/assistant", left: "49.3%", top: "80.4%", width: "15.2%", height: "1.8%" },
  { label: "Ver métodos de instalação Linux", href: "/download", left: "4.6%", top: "91.8%", width: "20.3%", height: "1.8%" },
  { label: "Baixar Stray Linux para Windows", href: distributionAssets.exe, left: "50.7%", top: "89.2%", width: "37.2%", height: "2.8%", download: "Stray-Linux-1.0.0-Setup.exe" },
  { label: "Abrir guia de desinstalação", href: "/uninstall", left: "56.1%", top: "94.8%", width: "12.3%", height: "1.8%" },
];

export function ReferenceLanding() {
  return <main className="min-h-screen bg-[#05101f] text-white">
    <h1 className="sr-only">Stray Linux — Linux Gaming Intelligence</h1>
    <p className="sr-only">A página inicial visual original do Stray Linux contém atalhos para download, aplicativo, Scanner, GameHub, LinuxFix, Benchmark, Stray AI e métodos de instalação.</p>
    <div className="mx-auto w-full max-w-[864px]">
      <div className="relative aspect-[288/607] w-full">
        <img src="/manus-storage/stray-linux-landing-original_68a8e472.png" alt="Landing original do Stray Linux criada pelo autor" className="pointer-events-none absolute inset-0 h-full w-full select-none" draggable={false} />
        {hotspots.map((spot) => <a key={`${spot.label}-${spot.left}`} href={spot.href} download={spot.download} aria-label={spot.label} className="absolute z-10 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05101f]" style={{ left: spot.left, top: spot.top, width: spot.width, height: spot.height }}><span className="sr-only">{spot.label}</span></a>)}
      </div>
    </div>
  </main>;
}
