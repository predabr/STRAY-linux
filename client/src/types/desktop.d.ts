export {};

declare global {
  interface Window {
    strayDesktop?: {
      scanner: { run: () => Promise<unknown> };
      maintenance: { preview: () => Promise<{ family: string; manager: string | null; generatedAt: string; privilege: { elevated: boolean; cleanupRequiresConfirmation: true }; warning: string; categories: Array<{ id: string; label: string; items: string[]; sizeMb?: number | null; command: string; note: string }> }> };
      performance: {
        pickLog: () => Promise<{
          cancelled: boolean;
          log: null | {
            source: "user-selected-mangohud-log";
            fileName: string;
            samples: Array<{ index: number; elapsed: number | null; fps: number | null; frameTimeMs: number | null }>;
            hasFps: boolean;
            hasFrameTime: boolean;
            summary: { parsedRows: number; fpsRange: { min: number; max: number } | null; frameTimeRange: { min: number; max: number } | null };
          };
        }>;
      };
      library: {
        scan: () => Promise<{ games: Array<{ id: string; appId: number | null; externalId: string; name: string; installDir: string | null; libraryPath: string; installationType: "native" | "flatpak" | "external"; launcher: "steam" | "heroic" | "external"; store: "steam" | "epic" | "external"; coverUrl: string | null; coverSource: "heroic-local-metadata" | "steam-public-cdn" | null }> }>;
        launch: (gameId: string) => Promise<{ launched: boolean }>;
        reveal: (gameId: string) => Promise<{ revealed: boolean }>;
        scanMods: () => Promise<{ source: "steam-workshop-local"; entries: Array<{ appId: number; modCount: number; path: string; installationType: "native" | "flatpak" }> }>;
        pickExternal: () => Promise<{ cancelled: boolean; game: { id: string; appId: null; externalId: string; name: string; installDir: string; libraryPath: string; installationType: "external"; launcher: "external"; store: "external"; coverUrl: null; coverSource: null } | null }>;
      };
      updates?: {
        status: () => Promise<{ state: string; version?: string; progress?: number; detail?: string }>;
        check: () => Promise<{ state: string; version?: string; progress?: number; detail?: string }>;
      };
    };
  }
}
