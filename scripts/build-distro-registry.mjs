import fs from "node:fs";
import path from "node:path";

const sourcePath = "/home/ubuntu/upload/pasted_content_2.txt";
const outputPath = path.resolve("shared/distro-registry.ts");
const lines = fs.readFileSync(sourcePath, "utf8").split(/\r?\n/);
let section = "Não classificada";
const registries = [];

const familyFromSection = (value) => {
  const normalized = value.toLowerCase();
  if (normalized.includes("arch")) return { id: "arch", label: "Arch e derivadas", install: "pacman" };
  if (normalized.includes("debian")) return { id: "debian", label: "Debian e derivadas", install: "apt" };
  if (normalized.includes("ubuntu")) return { id: "ubuntu", label: "Ubuntu e derivadas", install: "apt" };
  if (normalized.includes("red hat") || normalized.includes("fedora")) return { id: "rpm", label: "Fedora, RHEL e derivadas", install: "dnf" };
  if (normalized.includes("suse")) return { id: "suse", label: "SUSE e openSUSE", install: "zypper" };
  if (normalized.includes("gentoo")) return { id: "gentoo", label: "Gentoo e derivadas", install: "emerge" };
  if (normalized.includes("slackware")) return { id: "slackware", label: "Slackware e derivadas", install: "slackpkg" };
  if (normalized.includes("bsd") || normalized.includes("unix-like")) return { id: "reference", label: "Referência não Linux", install: null };
  if (normalized.includes("históric")) return { id: "historical", label: "Histórica ou descontinuada", install: null };
  return { id: "other", label: "Base própria ou família mista", install: null };
};

const overrides = {
  "Void Linux": ["void", "Void Linux", "xbps-install"],
  "NixOS": ["nix", "NixOS", "nix"],
  "Guix System": ["guix", "Guix System", "guix"],
  "Alpine Linux": ["alpine", "Alpine Linux", "apk"],
  "Solus": ["solus", "Solus", "eopkg"],
  "Mageia": ["mageia", "Mageia", "dnf"],
  "OpenMandriva": ["openmandriva", "OpenMandriva", "dnf"],
  "ROSA Linux": ["rosa", "ROSA Linux", "dnf"],
  "PCLinuxOS": ["pclinuxos", "PCLinuxOS", "apt-rpm"],
  "Clear Linux": ["clear-linux", "Clear Linux", "swupd"],
  "SteamOS": ["arch", "SteamOS", "flatpak-or-appimage"],
  "SteamOS 3 Holo": ["arch", "SteamOS", "flatpak-or-appimage"],
  "Bazzite": ["atomic", "Bazzite e Universal Blue", "flatpak-or-appimage"],
  "Aurora": ["atomic", "Aurora e Universal Blue", "flatpak-or-appimage"],
  "Fedora Silverblue": ["atomic", "Fedora Atomic", "flatpak-or-appimage"],
  "Fedora Kinoite": ["atomic", "Fedora Atomic", "flatpak-or-appimage"],
  "openSUSE MicroOS": ["atomic", "openSUSE transacional", "flatpak-or-appimage"],
  "openSUSE Aeon": ["atomic", "openSUSE transacional", "flatpak-or-appimage"],
};

for (const line of lines) {
  const heading = line.match(/^\d+\.\s+(.+)$/);
  if (heading) { section = heading[1].trim(); continue; }
  if (!line.startsWith("- ")) continue;
  const name = line.slice(2).trim();
  const inferred = familyFromSection(section);
  const override = overrides[name];
  const family = override ? { id: override[0], label: override[1], install: override[2] } : inferred;
  const lower = `${section} ${name}`.toLowerCase();
  const referenceOnly = family.id === "reference" || /\b(bsd|solaris|illumos|haiku|reactos|freedos|android|chromeos|webos|kaios)\b/i.test(name);
  const historical = family.id === "historical" || /históric|descontinuad|antiga|antecessora|original/i.test(lower);
  registries.push({ id: `${section}-${name}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), name, section, family: family.label, installer: family.install, support: referenceOnly ? "reference-only" : historical ? "historical" : family.install ? "package-family" : "research-required" });
}

const unique = registries.filter((entry, index) => registries.findIndex((candidate) => candidate.id === entry.id) === index);
const audit = { generatedAt: new Date().toISOString(), source: "pasted_content_2.txt", totalListed: registries.length, uniqueEntries: unique.length, entries: unique };
const moduleSource = `export type DistroRegistryEntry = { id: string; name: string; section: string; family: string; installer: string | null; support: "package-family" | "historical" | "reference-only" | "research-required" };\n\nexport const distroRegistry = ${JSON.stringify(audit, null, 2)} as const;\n`;
fs.writeFileSync(outputPath, moduleSource);
console.log(JSON.stringify({ outputPath, totalListed: audit.totalListed, uniqueEntries: audit.uniqueEntries, packageFamilyEntries: unique.filter((entry) => entry.support === "package-family").length, historical: unique.filter((entry) => entry.support === "historical").length, referenceOnly: unique.filter((entry) => entry.support === "reference-only").length }));
