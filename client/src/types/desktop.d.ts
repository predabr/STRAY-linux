export {};

declare global {
  interface Window {
    strayDesktop?: {
      scanner: { run: () => Promise<unknown> };
      library: {
        scan: () => Promise<{ games: Array<{ id: string; appId: number | null; externalId: string; name: string; installDir: string | null; libraryPath: string; installationType: "native" | "flatpak"; launcher: "steam" | "heroic"; store: "steam" | "epic"; coverUrl: string | null; coverSource: "heroic-local-metadata" | null }> }>;
        launch: (gameId: string) => Promise<{ launched: boolean }>;
        scanMods: () => Promise<{ source: "steam-workshop-local"; entries: Array<{ appId: number; modCount: number; path: string; installationType: "native" | "flatpak" }> }>;
      };
    };
  }
}
