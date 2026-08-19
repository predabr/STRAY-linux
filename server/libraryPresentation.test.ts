import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("biblioteca local", () => {
  it("filtra fontes locais sem alegar que elas foram sincronizadas da rede", () => {
    const component = fs.readFileSync(path.join(projectRoot, "client/src/pages/Library.tsx"), "utf8");
    expect(component).toContain("sourceFilter");
    expect(component).toContain("sourceCounts");
    expect(component).toContain("lastLocalRead");
    expect(component).toContain("stray-library-readout");
    expect(component).toContain("stray-library-card");
    expect(component).toContain("Steam");
    expect(component).toContain("Heroic");
    expect(component).toContain("Nenhum catálogo, conta, token ou lista de jogos é enviado para fora do dispositivo.");
    expect(component).toContain("games.resolveInstalled");
    expect(component).toContain("onReveal");
    expect(component).toContain('game.launcher === "steam"');
    expect(component).toContain("Jogar pelo Steam");
    expect(component).toContain("Abrir instalação");
    expect(component).toContain("ARTE AUSENTE");
    expect(component).toContain("Sem arte disponível nesta leitura.");
    expect(component).toContain("revealing={revealing === game.id}");
    expect(component).toContain('disabled={revealing}');
    expect(component).toContain('revealing ? "Abrindo pasta…" : "Abrir instalação"');
    expect(component).toContain("Jogo detectado pelo Heroic");
    expect(component).toContain("A solicitação foi enviada ao Steam. O launcher decide se o jogo abre.");
    expect(component).toContain("A pasta de instalação foi aberta localmente.");
    expect(component).toContain('role="status"');
    expect(component).toContain('notice?.tone === "success"');
    expect(component).not.toContain("biblioteca sincronizada");
  });
});
