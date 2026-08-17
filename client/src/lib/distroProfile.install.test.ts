import { describe, expect, it } from "vitest";
import { profileFor } from "../pages/DistroProfile";

describe("perfil de instalação por distribuição", () => {
  it("usa o comando publicado completo para famílias APT, sem assumir que o pacote já foi baixado", () => {
    const profile = profileFor({ id: "test-apt", name: "Derivada Debian", section: "TESTE", family: "Debian", installer: "apt", support: "package-family" });
    expect(profile.artifact).toBe(".deb");
    expect(profile.install).toContain("curl --fail --location --show-error --silent --retry 3");
    expect(profile.install).toContain("sha256sum --check --status");
    expect(profile.install).toContain("test -s \"$checksum\"");
    expect(profile.install).toContain("sudo dpkg -i /tmp/stray-linux.deb");
  });

  it("usa o AppImage publicado para entradas sem instalador nativo confirmado", () => {
    const profile = profileFor({ id: "test-portable", name: "Perfil de referência", section: "TESTE", family: "Mista", installer: null, support: "research-required" });
    expect(profile.artifact).toBe(".AppImage");
    expect(profile.install).toContain("curl --fail --location --show-error --silent --retry 3");
    expect(profile.install).toContain("sha256sum --check --status");
  });
});
