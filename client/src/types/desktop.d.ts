export {};

declare global {
  interface Window {
    strayDesktop?: {
      scanner: { run: () => Promise<unknown> };
      library: {
        scan: () => Promise<{ games: Array<{ id: string; appId: number | null; externalId: string; name: string; installDir: string | null; libraryPath: string; installationType: "native" | "flatpak" | "external"; launcher: "steam" | "heroic" | "external"; store: "steam" | "epic" | "external"; coverUrl: string | null; coverSource: "heroic-local-metadata" | "steam-public-cdn" | null }> }>;
        launch: (gameId: string) => Promise<{ launched: boolean }>;
        reveal: (gameId: string) => Promise<{ revealed: boolean }>;
        scanMods: () => Promise<{ source: "steam-workshop-local"; entries: Array<{ appId: number; modCount: number; path: string; installationType: "native" | "flatpak" }> }>;
        pickExternal: () => Promise<{ cancelled: boolean; game: { id: string; appId: null; externalId: string; name: string; installDir: string; libraryPath: string; installationType: "external"; launcher: "external"; store: "external"; coverUrl: null; coverSource: null } | null }>;
      };
    };
  }
}
